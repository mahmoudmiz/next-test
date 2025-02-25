"use client";

import { useState } from "react";

import Image from "next/image";
import { GitHubUser } from "types";

import styles from "./card.module.css";

function Card({ user }: { user: GitHubUser }) {
  const [favorites, setFavorites] = useState<Set<number>>(new Set());

  const toggleFavorite = (userId: number) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(userId)) {
        newFavorites.delete(userId);
      } else {
        newFavorites.add(userId);
      }
      return newFavorites;
    });
  };

  return (
    <div className={styles.userCard}>
      <div className={styles.cardHeader}>
        <Image
          src={user.avatar_url}
          alt={`${user.login}'s avatar`}
          width={100}
          height={100}
          className={styles.avatar}
        />
        <h2>{user.name || user.login}</h2>
      </div>
      <div className={styles.cardBody}>
        {user.bio && <p>{user.bio}</p>}

        <div className={styles.cardBodyContainer}>
        <a
          href={user.repos_url}
          target="_blank"
          rel="noreferrer"
          className={styles.repoLink}
        >
          View Repositories
        </a>
        <button
          onClick={() => toggleFavorite(user.id)}
          className={`${styles.favoriteButton} ${
            favorites.has(user.id) ? styles.favorited : ""
          }`}
        >
          {favorites.has(user.id) ? "★" : "☆"}
        </button>
        </div>
    
      </div>
    </div>
  );
}

export default Card;
