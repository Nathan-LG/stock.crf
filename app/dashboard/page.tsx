import Head from "next/head";
import PageLayout from "@/components/PageLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
};

const Dashboard = async () => {
  return (
    <div>
      <Head>
        <meta charSet="utf-8" />
      </Head>
      <PageLayout></PageLayout>
    </div>
  );
};
export default Dashboard;