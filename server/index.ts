import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Health check endpoints - registered immediately before async operations
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Additional health check endpoints for deployment services
app.get('/healthz', (req, res) => {
  res.status(200).send('OK');
});

app.get('/ready', (req, res) => {
  res.status(200).json({ 
    status: 'ready', 
    timestamp: new Date().toISOString() 
  });
});

// Root endpoint removed - Vite will serve the frontend

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  try {
    // Register routes - simplified initialization
    const server = await registerRoutes(app);

    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";

      res.status(status).json({ message });
      log(`Error: ${message}`, 'error');
    });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    // Serve static files with proper headers for production health checks
    serveStatic(app);
    
    // Catch-all route for SPA routing in production
    app.get('*', (req, res, next) => {
      // Skip API routes and health checks
      if (req.path.startsWith('/api') || 
          req.path === '/health' || 
          req.path === '/healthz' || 
          req.path === '/ready' || 
          req.path === '/') {
        return next();
      }
      // For other routes, serve the main app
      res.sendFile('index.html', { root: 'dist' }, (err) => {
        if (err) {
          res.status(404).json({ error: 'Page not found' });
        }
      });
    });
  }

    // Non-blocking database initialization
    const initializeDatabase = async () => {
      try {
        const { storage } = await import('./storage');
        await storage.upsertUser({
          id: 'tylerbustard',
          email: 'tyler@tylerbustard.com',
          firstName: 'Tyler',
          lastName: 'Bustard',
        });
        log('Tyler Bustard user ready for PDF uploads');
      } catch (error) {
        log('Note: Employer user initialization - ' + error, 'error');
      }
    };

    // Start database initialization in background (non-blocking)
    initializeDatabase().catch(error => {
      log('Database initialization failed, but server will continue: ' + error, 'error');
    });

    // Serve the app on the configured port/host. Default to 5000 on localhost in dev.
    const port = parseInt(process.env.PORT || '5000', 10);
    const host = process.env.HOST || '0.0.0.0'; // Always bind to 0.0.0.0 for deployment
    
    // Add error handling for server listen operation
    server.on('error', (error: any) => {
      if (error.code === 'EADDRINUSE') {
        log(`Port ${port} is already in use`, 'error');
      } else if (error.code === 'EACCES') {
        log(`Permission denied to bind to port ${port}`, 'error');
      } else {
        log(`Server error: ${error.message}`, 'error');
      }
      process.exit(1);
    });

    const listenOptions: any = { port, host };
    // reusePort is not supported on some platforms (e.g., macOS). Disable for compatibility.
    // if (app.get('env') !== 'development') {
    //   listenOptions.reusePort = true;
    // }

    server.listen(listenOptions, () => {
      log(`✅ Server is ready and serving on http://${host}:${port}`);
      log(`✅ Health check available at http://${host}:${port}/health`);
      log(`✅ Environment: ${process.env.NODE_ENV || 'development'}`);
      log(`✅ Process ID: ${process.pid}`);
    });
  
  } catch (error) {
    log(`Fatal error during server initialization: ${error}`, 'error');
    process.exit(1);
  }
})();
