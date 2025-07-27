import { loadEnv, defineConfig } from '@medusajs/framework/utils'

/**
 * Load environment variables from .env file based on NODE_ENV
 */
loadEnv(process.env.NODE_ENV || 'development', process.cwd())

export default defineConfig({
  /**
   * تنظیمات اصلی پروژه
   */
  projectConfig: {
    databaseDriverOptions: {
      ssl: false,
      sslmode: 'disable',
    },
    databaseUrl: process.env.DATABASE_URL!,
    redisUrl: process.env.REDIS_URL!,
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET || 'supersecret',
      cookieSecret: process.env.COOKIE_SECRET || 'supersecret',
    },
  },

  /**
   * ماژول‌های رجیسترشده
   */
  modules: {
    eventBus: {
      resolve: '@medusajs/event-bus-redis',
      options: {
        redisUrl: process.env.REDIS_URL,
      },
    },
    cacheService: {
      resolve: '@medusajs/cache-redis',
      options: {
        redisUrl: process.env.REDIS_URL,
      },
    },
  },

  /**
   * پیکربندی پنل Admin (Built‑in)
   */
  admin: {
    // فعال‌سازی پنل (false = غیرفعال)
    disable: false,
    // مسیر دسترسی به پنل
    path: '/app',
    // URL کامل Backend (بدون /app)
    backendUrl: process.env.MEDUSA_BACKEND_URL || 'http://localhost:9000',
    // پیکربندی Vite Dev Server برای رفع خطای Blocked request
    vite: () => ({
      server: {
        host: '0.0.0.0',
        port: 9000,
        allowedHosts: [
          // دامنهٔ اصلی شما
          'ekgw40gcws8wg8g8cks44ss8.sites.hamyarserver.com',
          // wildcard برای همه زیر‌دامنه‌ها
          '.sites.hamyarserver.com',
          // در صورت نیاز برای تست لوکال
          'localhost',
        ],
      },
    }),
  },
})
