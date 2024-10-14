"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import revalidate from "@/app/utils/api/actions";
import { IconExclamationCircle } from "@tabler/icons-react";
import clsx from "clsx";
import Select from "react-select";
import { selectStyle } from "@/app/utils/ui/actions";

const AddMissionForm = ({ users }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  async function onSubmit(data) {
    setIsLoading(true);
    setError(null);

    const formData = data;

    try {
      const response = await fetch("/api/missions", {
        method: "POST",
        body: new URLSearchParams(formData),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.error.message);
      } else {
        revalidate("/dashboard/missions");
        router.push("/dashboard/missions");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const options = users.map((user) => ({
    value: user.email,
    label: user.email,
  }));

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="row row-cards">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <div className="row">
                <h3 className="card-title">Nouvelle mission</h3>
                <p className="card-subtitle">
                  Chaque mission doit avoir un responsable matériel.
                </p>

                {error && (
                  <div
                    className="alert alert-danger alert-dismissible"
                    role="alert"
                  >
                    <div className="d-flex">
                      <div>
                        <IconExclamationCircle className="alert-icon" />
                      </div>
                      <div>{error}</div>
                    </div>
                    <a
                      className="btn-close"
                      data-bs-dismiss="alert"
                      aria-label="close"
                    ></a>
                  </div>
                )}

                <div className="col-xl-6 col-sm-12">
                  <div className="mb-3">
                    <label className="form-label required">Nom</label>
                    <input
                      id="name"
                      type="text"
                      className={clsx(
                        "form-control",
                        errors.name && "is-invalid",
                      )}
                      placeholder="Journées Brassens - Samedi"
                      {...register("name", { required: true, minLength: 3 })}
                    />
                    <div className="invalid-feedback">
                      {errors.name?.type === "required" && (
                        <>Le nom est obligatoire.</>
                      )}
                      {errors.name?.type === "minLength" && (
                        <>Le nom doit faire au moins 3 caractères.</>
                      )}
                    </div>
                  </div>
                </div>

                <div className="col-xl-6 col-sm-12">
                  <div className="mb-3">
                    <label className="form-label required">
                      Responsble matériel
                    </label>

                    <Controller
                      control={control}
                      name="userEmail"
                      render={({ field }) => (
                        <Select
                          onChange={(val) => field.onChange(val.value)}
                          options={options}
                          placeholder="Sélectionner"
                          styles={selectStyle}
                          value={options.find((c) => c.value === field.value)}
                        />
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="card-footer text-end">
              <button
                type="submit"
                className={clsx("btn btn-primary", isLoading && "btn-loading")}
                disabled={isLoading}
              >
                Ajouter
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default AddMissionForm;