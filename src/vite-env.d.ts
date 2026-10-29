/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_ANON_KEY?: string;
  readonly VITE_OPENAI_API_KEY?: string;
  readonly VITE_GEMINI_API_KEY?: string;
  readonly VITE_RAZORPAY_KEY_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
