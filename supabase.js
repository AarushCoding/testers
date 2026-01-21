import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

export const supabase = createClient(
    "https://hjfclbfqlrpiyfrxifut.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhqZmNsYmZxbHJwaXlmcnhpZnV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg0MTAzMzEsImV4cCI6MjA4Mzk4NjMzMX0.MvsITfTMFgTVzHh2iVBj06-lldlqMEjU8AWkL0y2uIE"
);
