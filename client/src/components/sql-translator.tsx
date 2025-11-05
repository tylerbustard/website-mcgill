import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Database, ArrowRight, Copy, HelpCircle, Loader2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

interface SQLTranslationResponse {
  sql: string;
  explanation: string;
}

export default function SQLTranslator() {
  const [naturalLanguageInput, setNaturalLanguageInput] = useState("");
  const [sqlOutput, setSqlOutput] = useState("");
  const [explanation, setExplanation] = useState("");
  const { toast } = useToast();
  const sectionAnimation = useScrollAnimation({ threshold: 0.15, triggerOnce: true });
  const headerAnimation = useScrollAnimation({ threshold: 0.25, triggerOnce: true, delay: 100 });

  const translateMutation = useMutation({
    mutationFn: async (naturalLanguage: string): Promise<SQLTranslationResponse> => {
      const response = await apiRequest("/api/translate-sql", "POST", { naturalLanguage });
      return response.json();
    },
    onSuccess: (data) => {
      setSqlOutput(data.sql);
      setExplanation(data.explanation);
      toast({
        title: "Translation successful",
        description: "Your natural language query has been converted to SQL.",
      });
    },
    onError: (error) => {
      toast({
        title: "Translation failed",
        description: error.message || "Failed to translate query. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleTranslate = () => {
    if (!naturalLanguageInput.trim()) {
      toast({
        title: "Input required",
        description: "Please enter a natural language query first.",
        variant: "destructive",
      });
      return;
    }
    translateMutation.mutate(naturalLanguageInput.trim());
  };

  const handleCopySQL = async () => {
    if (!sqlOutput) return;
    
    try {
      await navigator.clipboard.writeText(sqlOutput);
      toast({
        title: "Copied!",
        description: "SQL query copied to clipboard.",
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Failed to copy to clipboard.",
        variant: "destructive",
      });
    }
  };

  const handleSampleQuery = (query: string) => {
    setNaturalLanguageInput(query);
  };

  const sampleQueries = [
    "Find all stocks with P/E ratio below 15 and dividend yield above 3%",
    "Calculate the average portfolio return for the last 12 months",
    "Show top 10 performing stocks in the technology sector this quarter",
  ];

  const schemaInfo = [
    {
      table: "stocks",
      columns: [
        "symbol - VARCHAR(10) PRIMARY KEY",
        "company_name - VARCHAR(200)",
        "sector - VARCHAR(100)",
        "market_cap - BIGINT",
        "pe_ratio - DECIMAL(8,2)",
        "dividend_yield - DECIMAL(5,2)",
        "last_updated - TIMESTAMP",
      ],
    },
    {
      table: "portfolios",
      columns: [
        "id - INTEGER PRIMARY KEY",
        "portfolio_name - VARCHAR(100)",
        "client_id - INTEGER",
        "total_value - DECIMAL(15,2)",
        "risk_level - VARCHAR(20)",
        "created_date - DATE",
      ],
    },
    {
      table: "portfolio_holdings",
      columns: [
        "id - INTEGER PRIMARY KEY",
        "portfolio_id - INTEGER (FK to portfolios.id)",
        "stock_symbol - VARCHAR(10) (FK to stocks.symbol)",
        "shares - INTEGER",
        "purchase_price - DECIMAL(10,2)",
        "purchase_date - DATE",
      ],
    },
    {
      table: "stock_prices",
      columns: [
        "id - INTEGER PRIMARY KEY",
        "stock_symbol - VARCHAR(10) (FK to stocks.symbol)",
        "price - DECIMAL(10,2)",
        "volume - BIGINT",
        "price_date - DATE",
      ],
    },
  ];

  return (
    <section 
      ref={sectionAnimation.ref}
      id="sql-translator" 
      className={`py-16 sm:py-24 lg:py-32 relative overflow-hidden scroll-fade-in ${sectionAnimation.isVisible ? 'visible' : ''}`}>
      <div className="container-width">
        <div 
          ref={headerAnimation.ref}
          className={`text-center mb-8 sm:mb-12 lg:mb-16 scroll-slide-up ${headerAnimation.isVisible ? 'visible' : ''}`}
        >
          <h2 className="text-5xl lg:text-6xl font-bold text-foreground mb-6 tracking-tight">
            <Database className="inline-block text-primary mr-4" />
            Financial Data Analytics Tool
          </h2>
          <p className="text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Transform financial questions into SQL queries using AI. Perfect for portfolio analysis, stock research, and investment reporting.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Sample Database Schema */}
          <Card className="shadow-2xl">
            <CardContent className="p-10">
              <h3 className="text-xl font-bold text-foreground mb-6">
                <Database className="inline-block text-primary mr-2" />
                Financial Database Schema
              </h3>
              <div className="space-y-6">
                {schemaInfo.map((schema, index) => (
                  <div key={index} className="bg-muted rounded-2xl p-6" data-testid={`schema-${index}`}>
                    <h4 className="text-lg font-bold text-foreground mb-3">{schema.table}</h4>
                    <div className="text-sm text-secondary space-y-1">
                      {schema.columns.map((column, columnIndex) => (
                        <div key={columnIndex}>
                          <code className="bg-background px-1 rounded">{column.split(' - ')[0]}</code>
                          {' - '}
                          {column.split(' - ')[1]}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* SQL Translator Interface */}
          <Card className="shadow-2xl">
            <CardContent className="p-10">
              <h3 className="text-xl font-bold text-foreground mb-6">
                <ArrowRight className="inline-block text-primary mr-2" />
                Investment Query Builder
              </h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Investment Research Question
                  </label>
                  <Textarea
                    value={naturalLanguageInput}
                    onChange={(e) => setNaturalLanguageInput(e.target.value)}
                    placeholder="Example: Show me all technology stocks with market cap over $1B and P/E ratio below 20"
                    className="h-32 resize-none"
                    data-testid="input-natural-language"
                  />
                </div>

                <div className="flex justify-between items-center">
                  <Badge variant="secondary" className="text-xs">
                    Powered by OpenAI GPT-4
                  </Badge>
                  <Button 
                    onClick={handleTranslate}
                    disabled={translateMutation.isPending}
                    data-testid="button-translate"
                  >
                    {translateMutation.isPending ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <ArrowRight className="mr-2 h-4 w-4" />
                    )}
                    Generate Query
                  </Button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Financial Analysis Query
                  </label>
                  <div className="bg-gray-900 rounded-2xl p-6 h-32 overflow-auto">
                    <pre className="text-green-400 text-sm" style={{fontFamily: 'ui-monospace, SFMono-Regular, SF Mono, Consolas, Liberation Mono, Menlo, monospace'}} data-testid="output-sql">
                      {sqlOutput || "// Financial analysis query will appear here"}
                    </pre>
                  </div>
                </div>

                {explanation && (
                  <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
                    <h4 className="font-medium text-blue-900 mb-2">Query Explanation:</h4>
                    <p className="text-blue-800 text-sm" data-testid="text-explanation">{explanation}</p>
                  </div>
                )}

                <div className="flex gap-4">
                  <Button
                    variant="secondary"
                    onClick={handleCopySQL}
                    disabled={!sqlOutput}
                    className="flex-1"
                    data-testid="button-copy"
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    Copy Query
                  </Button>
                  <Button
                    variant="outline"
                    disabled={!sqlOutput}
                    className="flex-1"
                    data-testid="button-explain"
                  >
                    <HelpCircle className="mr-2 h-4 w-4" />
                    Explain Query
                  </Button>
                </div>
              </div>

              {/* Sample Queries */}
              <div className="mt-8 pt-6 border-t border-border">
                <h4 className="text-lg font-semibold text-foreground mb-4">Try these examples:</h4>
                <div className="space-y-2">
                  {sampleQueries.map((query, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      onClick={() => handleSampleQuery(query)}
                      className="w-full text-left justify-start h-auto p-3 text-sm text-secondary hover:bg-muted"
                      data-testid={`button-sample-${index}`}
                    >
                      "{query}"
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
