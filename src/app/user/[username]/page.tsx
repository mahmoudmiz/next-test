"use server";

import Card from "components/card";
import { GitHubUser } from "types";

import styles from "./page.module.css";
import Link from "next/link";


const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default async function UserPage({
  params,
}: {
  params: { username: string };
}) {
  const { username } = params;
  const res = await fetch(`${API_URL}/${username}`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    return (
      <div>
        <h1>User not found</h1>
      </div>
    );
  }
  const data: GitHubUser = await res.json();

  return (
    <div className={styles.pageContainer}>
      <h2 className={styles.title}>GitHub User Details</h2>
      <Card user={data} />

      <Link href="/">
        <button className={styles.homeButton}>Go Home</button>
      </Link>
    </div>
  );
}