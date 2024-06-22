import supabase from "@/server/supabase"

export async function getSubscription(userId: string) {
  const { data } = await supabase
    .from('subscriptions')
    .select()
    .eq('userId', userId)
    .limit(1)
    .single()
  
  return data 
}

export async function saveSubscription(subscription: any) {
  const { data } = await supabase
    .from('subscriptions')
    .insert(subscription)
}