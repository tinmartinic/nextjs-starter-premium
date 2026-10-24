'use server';

import { eq } from 'drizzle-orm';

import { db } from '@/lib/db/drizzle';
import posts from '@/lib/db/schema/post';
import { Post } from '@/models/types';

export const getPostById = async (id: string): Promise<Post | null> => {
  try {
    const post = await db.select().from(posts).where(eq(posts.id, id)).execute();

    return post[0] || null;
  } catch (error) {
    console.error('Error fetching post by ID:', error);
    return null;
  }
};

export const getPostByTitle = async (title: string): Promise<Post | null> => {
  try {
    const post = await db.select().from(posts).where(eq(posts.title, title)).execute();

    return post[0] || null;
  } catch (error) {
    console.error('Error fetching post by Title:', error);
    return null;
  }
};

export const getAllPosts = async (): Promise<Post[]> => {
  try {
    const postList = await db.select().from(posts).execute();

    return postList;
  } catch (error) {
    console.error('Error fetching all posts:', error);
    return [];
  }
};
