"use client";

import Image from "next/image";
import styles from "./page.module.css";
import { useState, useEffect, useCallback } from "react";
import { GitHubUser } from "types";

import useDebounce from "../hooks/useDebounce";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const API_SEARCH_URL = process.env.NEXT_PUBLIC_API_SEARCH_URL;

export default function Home() {
  const [users, setUsers] = useState<GitHubUser[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const fetchUsers = useCallback(async () => {
    if (!API_URL || !API_SEARCH_URL) {
      console.error("API URLs not set");
      return;
    }

    const endpoint = debouncedSearchQuery
      ? `${API_SEARCH_URL}${debouncedSearchQuery}`
      : API_URL;

    try {
      setIsLoading(true);
      const response = await fetch(endpoint);
      const data = await response.json();
      const formattedUsers = debouncedSearchQuery ? data.items : data;

      setUsers(formattedUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearchQuery]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers, debouncedSearchQuery]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1 className={styles.title}>GitHub Users Search</h1>

        <div className={styles.searchContainer}>
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search GitHub users..."
            className={styles.searchInput}
          />
        </div>
        {isLoading && <div className={styles.loading}>Loading...</div>}

        <div className={styles.usersGrid}>
          {users.map((user) => (
            <div key={user.id} className={styles.userCard}>
              <div className={styles.userAvatar}>
                <Image
                  src={user.avatar_url}
                  alt={`${user.login}'s avatar`}
                  width={100}
                  height={100}
                />
              </div>
              <div className={styles.userInfo}>
                <h2>{user.login}</h2>
                <div className={styles.actions}>
                  <Link
                    href={`/user/${user.login}`}
                    className={styles.detailsButton}
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
