import {
  type SqlQuery,
  type InsertSqlQuery,
  type ContactMessage,
  type InsertContactMessage,
  type User,
  type UpsertUser,
  type ResumeUpload,
  type InsertResumeUpload,
  type Video,
  type InsertVideo,
  users,
  sqlQueries,
  contactMessages,
  resumeUploads,
  videos,
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  createSqlQuery(query: InsertSqlQuery): Promise<SqlQuery>;
  getSqlQueries(): Promise<SqlQuery[]>;
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
  getContactMessages(): Promise<ContactMessage[]>;
  createResumeUpload(upload: InsertResumeUpload): Promise<ResumeUpload>;
  getResumeUploads(userId: string): Promise<ResumeUpload[]>;
  deleteResumeUpload(id: string, userId: string): Promise<boolean>;
  setActiveResume(id: string, userId: string): Promise<void>;
  deactivateOtherResumes(activeId: string, userId: string): Promise<void>;
  getActiveResume(userId: string): Promise<ResumeUpload | undefined>;
  createVideo(video: InsertVideo): Promise<Video>;
  getVideos(): Promise<Video[]>;
  getActiveVideo(): Promise<Video | undefined>;
  setActiveVideo(id: string): Promise<void>;
  deactivateOtherVideos(activeId: string): Promise<void>;
  deleteVideo(id: string): Promise<boolean>;
  updateVideoUrl?(id: string, fileUrl: string): Promise<void>;
}

// Decide at runtime whether to use database-backed storage or an in-memory dev fallback
const useMemoryStorage = !process.env.DATABASE_URL;

let storageImpl: IStorage;

if (useMemoryStorage) {
  // In-memory fallback for local development so preview works without a DB
  const mem = {
    users: [] as User[],
    sqlQueries: [] as SqlQuery[],
    contactMessages: [] as ContactMessage[],
    resumeUploads: [] as ResumeUpload[],
    videos: [] as Video[],
  };

  class MemoryStorage implements IStorage {
    async getUser(id: string): Promise<User | undefined> {
      return mem.users.find(u => u.id === id);
    }

    async upsertUser(userData: UpsertUser): Promise<User> {
      const existing = mem.users.find(u => u.id === userData.id);
      const now = new Date();
      if (existing) {
        Object.assign(existing, userData, { updatedAt: now });
        return existing;
      }
      const created: User = {
        id: userData.id || randomUUID(),
        email: userData.email || null as any,
        firstName: userData.firstName || null as any,
        lastName: userData.lastName || null as any,
        profileImageUrl: userData.profileImageUrl || null as any,
        createdAt: now as any,
        updatedAt: now as any,
      } as User;
      mem.users.push(created);
      return created;
    }

    async createSqlQuery(insertQuery: InsertSqlQuery): Promise<SqlQuery> {
      const created: SqlQuery = {
        id: randomUUID(),
        naturalQuery: insertQuery.naturalQuery,
        sqlQuery: insertQuery.sqlQuery,
        explanation: insertQuery.explanation,
        createdAt: new Date() as any,
      } as SqlQuery;
      mem.sqlQueries.unshift(created);
      return created;
    }

    async getSqlQueries(): Promise<SqlQuery[]> {
      return [...mem.sqlQueries];
    }

    async createContactMessage(insertMessage: InsertContactMessage): Promise<ContactMessage> {
      const created: ContactMessage = {
        id: randomUUID(),
        name: insertMessage.name,
        email: insertMessage.email,
        message: insertMessage.message,
        createdAt: new Date() as any,
      } as ContactMessage;
      mem.contactMessages.unshift(created);
      return created;
    }

    async getContactMessages(): Promise<ContactMessage[]> {
      return [...mem.contactMessages];
    }

    async createResumeUpload(upload: InsertResumeUpload): Promise<ResumeUpload> {
      const created: ResumeUpload = {
        id: randomUUID(),
        userId: upload.userId,
        fileName: upload.fileName,
        fileUrl: upload.fileUrl,
        fileSize: upload.fileSize,
        isActive: Boolean(upload.isActive),
        uploadedAt: new Date() as any,
        description: (upload as any).description ?? null,
      } as ResumeUpload;
      mem.resumeUploads.push(created);
      return created;
    }

    async getResumeUploads(userId: string): Promise<ResumeUpload[]> {
      return mem.resumeUploads.filter(r => r.userId === userId);
    }

    async deleteResumeUpload(id: string, userId: string): Promise<boolean> {
      const idx = mem.resumeUploads.findIndex(r => r.id === id && r.userId === userId);
      if (idx >= 0) {
        mem.resumeUploads.splice(idx, 1);
        return true;
      }
      return false;
    }

    async setActiveResume(id: string, userId: string): Promise<void> {
      const target = mem.resumeUploads.find(r => r.id === id && r.userId === userId);
      if (target) target.isActive = true as any;
    }

    async deactivateOtherResumes(activeId: string, userId: string): Promise<void> {
      mem.resumeUploads.forEach(r => {
        if (r.userId === userId && r.id !== activeId) r.isActive = false as any;
      });
    }

    async getActiveResume(userId: string): Promise<ResumeUpload | undefined> {
      return mem.resumeUploads.find(r => r.userId === userId && r.isActive);
    }

    async createVideo(insertVideo: InsertVideo): Promise<Video> {
      const created: Video = {
        id: randomUUID(),
        title: insertVideo.title,
        fileUrl: insertVideo.fileUrl,
        fileName: insertVideo.fileName,
        mimeType: insertVideo.mimeType,
        fileSize: insertVideo.fileSize,
        isActive: Boolean(insertVideo.isActive),
        uploadedBy: insertVideo.uploadedBy,
        uploadedAt: new Date() as any,
        createdAt: new Date() as any,
      } as Video;
      mem.videos.push(created);
      return created;
    }

    async getVideos(): Promise<Video[]> {
      return [...mem.videos].sort((a, b) => new Date(a.createdAt!).getTime() - new Date(b.createdAt!).getTime());
    }

    async getActiveVideo(): Promise<Video | undefined> {
      return mem.videos.find(v => v.isActive);
    }

    async setActiveVideo(id: string): Promise<void> {
      mem.videos.forEach(v => (v.isActive = v.id === id));
    }

    async deactivateOtherVideos(activeId: string): Promise<void> {
      mem.videos.forEach(v => { if (v.id !== activeId) v.isActive = false; });
    }

    async updateVideoUrl(id: string, fileUrl: string): Promise<void> {
      const v = mem.videos.find(v => v.id === id);
      if (v) v.fileUrl = fileUrl;
    }

    async deleteVideo(id: string): Promise<boolean> {
      const idx = mem.videos.findIndex(v => v.id === id);
      if (idx >= 0) { mem.videos.splice(idx, 1); return true; }
      return false;
    }
  }

  storageImpl = new MemoryStorage();
} else {
  // Database-backed implementation - initialize asynchronously
  storageImpl = new (class DatabaseStorageWrapper implements IStorage {
    private db: any = null;
    private eq: any = null;
    private ne: any = null;
    private and: any = null;

    private async init() {
      if (!this.db) {
        const dbModule = await import("./db");
        const ormModule = await import("drizzle-orm");
        this.db = dbModule.db;
        this.eq = ormModule.eq;
        this.ne = ormModule.ne;
        this.and = ormModule.and;
      }
    }

    async getUser(id: string): Promise<User | undefined> {
      await this.init();
      const [user] = await this.db.select().from(users).where(this.eq(users.id, id));
      return user || undefined;
    }

    async upsertUser(userData: UpsertUser): Promise<User> {
      await this.init();
      const [user] = await this.db
        .insert(users)
        .values(userData)
        .onConflictDoUpdate({
          target: users.id,
          set: {
            ...userData,
            updatedAt: new Date(),
          },
        })
        .returning();
      return user;
    }

    async createSqlQuery(insertQuery: InsertSqlQuery): Promise<SqlQuery> {
      await this.init();
      const [query] = await this.db
        .insert(sqlQueries)
        .values(insertQuery)
        .returning();
      return query;
    }

    async getSqlQueries(): Promise<SqlQuery[]> {
      await this.init();
      return await this.db.select().from(sqlQueries);
    }

    async createContactMessage(insertMessage: InsertContactMessage): Promise<ContactMessage> {
      await this.init();
      const [message] = await this.db
        .insert(contactMessages)
        .values(insertMessage)
        .returning();
      return message;
    }

    async getContactMessages(): Promise<ContactMessage[]> {
      await this.init();
      return await this.db.select().from(contactMessages);
    }

    async createResumeUpload(upload: InsertResumeUpload): Promise<ResumeUpload> {
      await this.init();
      const [resumeUpload] = await this.db
        .insert(resumeUploads)
        .values(upload)
        .returning();
      return resumeUpload;
    }

    async getResumeUploads(userId: string): Promise<ResumeUpload[]> {
      await this.init();
      return await this.db.select().from(resumeUploads).where(this.eq(resumeUploads.userId, userId));
    }

    async deleteResumeUpload(id: string, userId: string): Promise<boolean> {
      await this.init();
      const result = await this.db
        .delete(resumeUploads)
        .where(
          this.and(
            this.eq(resumeUploads.id, id),
            this.eq(resumeUploads.userId, userId)
          )
        );
      return (result as any).rowCount > 0;
    }

    async setActiveResume(id: string, userId: string): Promise<void> {
      await this.init();
      await this.db
        .update(resumeUploads)
        .set({ isActive: true })
        .where(
          this.and(
            this.eq(resumeUploads.id, id),
            this.eq(resumeUploads.userId, userId)
          )
        );
    }

    async deactivateOtherResumes(activeId: string, userId: string): Promise<void> {
      await this.init();
      await this.db
        .update(resumeUploads)
        .set({ isActive: false })
        .where(
          this.and(
            this.ne(resumeUploads.id, activeId),
            this.eq(resumeUploads.userId, userId)
          )
        );
    }

    async getActiveResume(userId: string): Promise<ResumeUpload | undefined> {
      await this.init();
      const [resume] = await this.db
        .select()
        .from(resumeUploads)
        .where(
          this.and(
            this.eq(resumeUploads.isActive, true),
            this.eq(resumeUploads.userId, userId)
          )
        );
      return resume;
    }

    async createVideo(insertVideo: InsertVideo): Promise<Video> {
      await this.init();
      const [video] = await this.db
        .insert(videos)
        .values(insertVideo)
        .returning();
      return video;
    }

    async getVideos(): Promise<Video[]> {
      await this.init();
      return await this.db.select().from(videos).orderBy(videos.createdAt);
    }

    async getActiveVideo(): Promise<Video | undefined> {
      await this.init();
      const [video] = await this.db.select().from(videos).where(this.eq(videos.isActive, true));
      return video;
    }

    async setActiveVideo(id: string): Promise<void> {
      await this.init();
      await this.db.update(videos).set({ isActive: false });
      await this.db.update(videos).set({ isActive: true }).where(this.eq(videos.id, id));
    }

    async deactivateOtherVideos(activeId: string): Promise<void> {
      await this.init();
      await this.db.update(videos).set({ isActive: false }).where(this.ne(videos.id, activeId));
    }

    async updateVideoUrl(id: string, fileUrl: string): Promise<void> {
      await this.init();
      await this.db.update(videos).set({ fileUrl }).where(this.eq(videos.id, id));
    }

    async deleteVideo(id: string): Promise<boolean> {
      await this.init();
      const result = await this.db.delete(videos).where(this.eq(videos.id, id));
      return (result as any).rowCount > 0;
    }
  })();
}

export const storage = storageImpl;
