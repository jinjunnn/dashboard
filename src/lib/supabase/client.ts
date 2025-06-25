import { createClient } from '@supabase/supabase-js'
import { getSupabaseConfig } from '@/lib/database/config'

// 客户端Supabase客户端 - 使用公共密钥
export function createSupabaseClient() {
  const config = getSupabaseConfig()
  
  return createClient(
    config.url,
    config.anonKey
  )
} 