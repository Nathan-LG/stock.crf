import type { Metadata } from "next";
import ContentLayout from "@/components/ContentLayout";

export const metadata: Metadata = {
  title: "Dashboard",
};

const pageData = {
  ariane: [{ label: "stock.crf", href: "/dashboard" }],
  title: "Dashboard",
  button: "",
  buttonIcon: undefined,
  buttonLink: "",
};

const Dashboard = () => <ContentLayout pageData={pageData}></ContentLayout>;
export default Dashboard;
