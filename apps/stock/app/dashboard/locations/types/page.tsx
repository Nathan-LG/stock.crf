import type { Metadata } from "next";
import ContentLayout from "@/components/ui/ContentLayout";
import { IconMoodEmpty, IconPlus } from "@tabler/icons-react";
import { prisma } from "@repo/db";
import DeleteModal from "@/components/ui/DeleteModal";
import EditLocationTypeModal from "@/components/locationType/EditLocationTypeModal";
import * as Sentry from "@sentry/nextjs";
import { redirect } from "next/navigation";

// Metadata

export const metadata: Metadata = {
  title: "Catégories d'emplacements",
};

// ----------------------------

const LocationsType = async () => {
  // Fetch location types

  let locationsType: {
    id: number;
    name: string;
    description: string;
    icon: string;
  }[];

  try {
    locationsType = await prisma.locationType.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        icon: true,
      },
      orderBy: {
        name: "asc",
      },
    });
  } catch (error) {
    Sentry.captureException(error);
    redirect("/errors/500");
  }

  // Page data

  const pageData = {
    ariane: [
      { label: "stock.crf", href: "/dashboard" },
      { label: "Emplacements", href: "/dashboard/locations" },
      { label: "Catégories", href: "/dashboard/locations/types" },
    ],
    title: "Liste des catégories d'emplacement",
    button: "Ajouter une catégorie",
    buttonIcon: <IconPlus className="icon" />,
    buttonLink: "/dashboard/locations/types/add",
  };

  if (locationsType.length === 0) {
    // DOM rendering if no location type found

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
    // DOM rendering if location types found

    return (
      <ContentLayout subHeaderProps={pageData}>
        <div className="col-12">
          <div className="card">
            <div className="table-responsive">
              <table className="table table-vcenter table-mobile-md card-table">
                <thead>
                  <tr>
                    <th className="w-1">Type</th>
                    <th>Nom</th>
                    <th>Description</th>
                    <th className="w-1"></th>
                  </tr>
                </thead>
                <tbody>
                  {locationsType.map((locationType) => (
                    <tr key={locationType.id}>
                      <td data-label="Type">
                        <i className={locationType.icon + " icon"}></i>
                      </td>
                      <td data-label="Nom">
                        <div className="d-flex py-1 align-items-center">
                          <div className="flex-fill">
                            <div className="font-weight-medium">
                              {locationType.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td data-label="Description">
                        <div>{locationType.description}</div>
                      </td>
                      <td>
                        <div className="btn-list flex-nowrap">
                          <button
                            className="btn"
                            data-bs-toggle="modal"
                            data-bs-target={"#modal-edit-" + locationType.id}
                          >
                            &Eacute;diter
                          </button>
                          <button
                            type="button"
                            className="btn"
                            data-bs-toggle="modal"
                            data-bs-target={"#modal-delete-" + locationType.id}
                          >
                            Supprimer
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {locationsType.map((locationType) => (
          <div key={locationType.id}>
            <EditLocationTypeModal
              id={locationType.id}
              name={locationType.name}
              description={locationType.description}
              icon={locationType.icon}
              createdAt={undefined}
              updatedAt={undefined}
            />

            <DeleteModal
              id={locationType.id}
              alert="Cela supprimera aussi tous les emplacements de ce type."
              message="Catégorie supprimée avec succès"
              url="/api/locations/types/"
            />
          </div>
        ))}
      </ContentLayout>
    );
  }
};

export default LocationsType;
