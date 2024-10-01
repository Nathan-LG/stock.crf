import { auth } from "@/auth";
import { prisma } from "@/prisma";
import Image from "next/image";
import { SignOutButton } from "@/components/auth/SignOutButton";
import {
  IconBandage,
  IconBriefcase2,
  IconBuildingWarehouse,
  IconHeartbeat,
  IconPlus,
  IconReplace,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react";
import Link from "next/link";
import { redirect } from "next/navigation";

async function Header() {
  const session = await auth();

  if (!session) redirect("/auth/signin");

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      name: true,
      group: {
        select: {
          name: true,
        },
      },
    },
  });

  return (
    <div className="page">
      <header className="navbar navbar-expand-md navbar-light d-print-none">
        <div className="container-xl">
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbar-menu"
            aria-controls="navbar-menu"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <h1 className="navbar-brand navbar-brand-autodark d-none-navbar-horizontal pe-0 pe-md-3">
            <Link href="/dashboard">
              <Image
                src="/stockcrf.svg"
                alt="stock.crf"
                width="187"
                height="32"
                priority={true}
              />
            </Link>
          </h1>

          <div className="navbar-nav flex-row order-md-last">
            <div className="nav-item dropdown">
              <a
                href="#"
                className="nav-link d-flex lh-1 text-reset p-0"
                data-bs-toggle="dropdown"
              >
                <span
                  className="avatar avatar-sm"
                  style={{ backgroundImage: `url(${session.user.image})` }}
                ></span>
                <div className="d-none d-xl-block ps-2">
                  <div>{user.name}</div>
                  <div className="mt-1 small text-secondary">
                    {user.group.name}
                  </div>
                </div>
              </a>
              <SignOutButton />
            </div>
          </div>
        </div>
      </header>
      <header className="navbar-expand-md">
        <div className="collapse navbar-collapse" id="navbar-menu">
          <div className="navbar">
            <div className="container-xl">
              <div className="row flex-fill align-items-center">
                <div className="col">
                  <ul className="navbar-nav">
                    <li className="nav-item">
                      <Link className="nav-link" href="/dashboard">
                        <span className="nav-link-icon d-md-none d-lg-inline-block">
                          <IconHeartbeat className="Icon" />
                        </span>
                        <span className="nav-link-title">Dashboard</span>
                      </Link>
                    </li>
                    <li className="nav-item dropdown">
                      <a
                        className="nav-link"
                        data-bs-toggle="dropdown"
                        role="button"
                      >
                        <span className="nav-link-icon d-md-none d-lg-inline-block">
                          <IconBuildingWarehouse className="Icon" />
                        </span>
                        <span className="nav-link-title">Emplacements</span>
                      </a>
                      <div className="dropdown-menu dropdown-menu-start">
                        <Link
                          className="dropdown-item"
                          href="/dashboard/locations"
                        >
                          Liste
                        </Link>
                        <Link
                          className="dropdown-item"
                          href="/dashboard/locations/types"
                        >
                          Catégories
                        </Link>
                        <div className="dropdown-divider"></div>
                        <Link
                          className="dropdown-item"
                          href="/dashboard/locations/add"
                        >
                          <IconPlus className="icon dropdown-item-icon" />{" "}
                          Emplacement
                        </Link>
                      </div>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" href="/dashboard/items">
                        <span className="nav-link-icon d-md-none d-lg-inline-block">
                          <IconBandage className="Icon" />
                        </span>
                        <span className="nav-link-title">Consommables</span>
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" href="/dashboard/movements">
                        <span className="nav-link-icon d-md-none d-lg-inline-block">
                          <IconReplace className="Icon" />
                        </span>
                        <span className="nav-link-title">Mouvements</span>
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" href="/dashboard/missions">
                        <span className="nav-link-icon d-md-none d-lg-inline-block">
                          <IconBriefcase2 className="Icon" />
                        </span>
                        <span className="nav-link-title">Missions</span>
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" href="/dashboard/users">
                        <span className="nav-link-icon d-md-none d-lg-inline-block">
                          <IconUsers className="Icon" />
                        </span>
                        <span className="nav-link-title">Secouristes</span>
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" href="/dashboard/admin">
                        <span className="nav-link-icon d-md-none d-lg-inline-block">
                          <IconSettings className="Icon" />
                        </span>
                        <span className="nav-link-title">Administration</span>
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}

export default Header;