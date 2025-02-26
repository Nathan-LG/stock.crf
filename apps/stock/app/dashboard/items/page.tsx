import type { Metadata } from "next";
import ContentLayout from "@/components/ui/ContentLayout";
import { IconMoodEmpty, IconPlus } from "@tabler/icons-react";
import { prisma } from "@repo/db";
import DeleteModal from "@/components/ui/DeleteModal";
import EditItemModal from "@/components/item/EditItemModal";
import Link from "next/link";
import * as Sentry from "@sentry/nextjs";
import { redirect } from "next/navigation";
import { ItemCategory } from "@repo/db";

// Metadata

export const metadata: Metadata = {
  title: "Consommables",
};

// ----------------------------

const Items = async () => {
  let items: {
    ItemCategory: {
      id: number;
      name: string;
      icon: string;
    };
    id: number;
    name: string;
    description: string;
    unit: string;
  }[];

  // Fetch all items ordered by category and name

  try {
    items = await prisma.item.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        unit: true,
        ItemCategory: {
          select: {
            id: true,
            name: true,
            icon: true,
          },
        },
      },
      orderBy: [
        {
          itemCategoryId: "asc",
        },
        {
          name: "asc",
        },
      ],
    });
  } catch (error) {
    Sentry.captureException(error);
    redirect("/errors/500");
  }

  let categories: ItemCategory[];

  try {
    categories = await prisma.itemCategory.findMany();
  } catch (error) {
    Sentry.captureException(error);
    redirect("/errors/500");
  }

  let lastCategory = -1;

  // Page data

  const pageData = {
    ariane: [
      { label: "stock.crf", href: "/dashboard" },
      { label: "Consommables", href: "/dashboard/items" },
    ],
    title: "Liste des consommables",
    button: "Ajouter un consommable",
    buttonIcon: <IconPlus className="icon" />,
    buttonLink: "/dashboard/items/add",
  };

  if (items.length === 0) {
    // DOM rendering if there are no items

    return (
      <ContentLayout subHeaderProps={pageData}>
        <div className="col-12">
          <div className="card">
            <div className="empty">
              <div className="empty-icon">
                <IconMoodEmpty className="icon" />
              </div>
              <p className="empty-title">C&apos;est vide...</p>
              <p className="empty-subtitle text-secondary">
                Si vous pensez qu&apos;il s&apos;agit d&apos;une erreur,
                signalez-le au plus vite.
              </p>
            </div>
          </div>
        </div>
      </ContentLayout>
    );
  } else {
    // DOM rendering if there are items

    return (
      <ContentLayout subHeaderProps={pageData}>
        <div className="col-12">
          <div className="card">
            <div className="table-responsive">
              <table className="table card-table table-vcenter text-nowrap datatable">
                <thead>
                  <tr>
                    <th className="w-1">Type</th>
                    <th>Nom</th>
                    <th>Description</th>
                    <th className="w-1"></th>
                  </tr>
                </thead>

                {items.map((item) => {
                  let header = <></>;

                  if (lastCategory !== item.ItemCategory.id) {
                    header = (
                      <tr>
                        <th colSpan={4}>{item.ItemCategory.name}</th>
                      </tr>
                    );
                  }

                  lastCategory = item.ItemCategory.id;

                  return (
                    <tbody key={item.id}>
                      {header}
                      <tr>
                        <td>
                          <i className={`icon ${item.ItemCategory.icon}`}></i>
                        </td>
                        <td>
                          <Link href={"/dashboard/items/" + item.id}>
                            {item.name}
                          </Link>
                        </td>
                        <td>{item.description}</td>
                        <td>
                          <div className="btn-list flex-nowrap">
                            <button
                              className="btn"
                              data-bs-toggle="modal"
                              data-bs-target={"#modal-edit-" + item.id}
                            >
                              &Eacute;diter
                            </button>
                            <button
                              type="button"
                              className="btn"
                              data-bs-toggle="modal"
                              data-bs-target={"#modal-delete-" + item.id}
                            >
                              Supprimer
                            </button>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  );
                })}
              </table>
            </div>
          </div>

          {items.map((item) => (
            <div key={item.id}>
              <EditItemModal
                formProps={{
                  item: {
                    ...item,
                    createdAt: undefined,
                    updatedAt: undefined,
                    itemCategoryId: item.ItemCategory.id,
                  },
                  categories,
                }}
              />

              <DeleteModal
                id={item.id}
                alert="Cela supprimera définitivement le consommable."
                message="Consommable supprimé avec succès"
                url="/api/items/"
              />
            </div>
          ))}
        </div>
      </ContentLayout>
    );
  }
};

export default Items;
