import { redirect } from "next/navigation";

export default function Home() {
  redirect("/signals");
  return <>Coming Soon</>;
}
