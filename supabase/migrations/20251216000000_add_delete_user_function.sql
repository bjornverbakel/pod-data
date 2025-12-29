-- function to allow users to delete their own account
create or replace function public.delete_user() returns void language plpgsql security definer
set search_path = public as $$ begin
delete from auth.users
where id = auth.uid();
end;
$$;
-- Grant execute permission to authenticated users
grant execute on function public.delete_user() to authenticated;