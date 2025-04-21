
import { supabase } from "@/integrations/supabase/client";
import { type AuthError } from "@supabase/supabase-js";

export type SignUpData = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
};

export async function signUp({ email, password, firstName, lastName, phone }: SignUpData) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: firstName,
        last_name: lastName,
        phone,
      },
    },
  });

  if (error) throw error;
  return data;
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}
