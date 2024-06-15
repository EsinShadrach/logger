import { LandingPage } from "~/components/landing-page";
import { actualUser, postsTable, usersTable } from "~/drizzle/schema";
import { db } from "~/utils/db";

import { asc, count, eq, getTableColumns, gt, sql } from "drizzle-orm";

async function getUsersWithPostsCount(
  page = 1,
  pageSize = 5
): Promise<
  Array<{
    postsCount: number;
    id: number;
    name: string;
    age: number;
    email: string;
  }>
> {
  return db
    .select({
      ...getTableColumns(usersTable),
      postsCount: count(postsTable.id),
    })
    .from(usersTable)
    .leftJoin(postsTable, eq(usersTable.id, postsTable.userId))
    .groupBy(usersTable.id)
    .orderBy(asc(usersTable.id))
    .limit(pageSize)
    .offset((page - 1) * pageSize);
}

export default async function Home() {
  var xr = await getUsersWithPostsCount();
  console.log(xr);
  return <LandingPage />;
}
