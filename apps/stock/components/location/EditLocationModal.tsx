"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import revalidate from "@/app/utils/api/actions";
import toast from "@/app/utils/ui/actions";
import clsx from "clsx";
import type { Location, LocationType } from "@repo/db";
import { IconEdit } from "@tabler/icons-react";
import Select from "react-select";
import { selectStyle } from "@/app/utils/ui/actions";
import IconOption from "@/components/ui/IconOptions";

type LocationFormProps = {
  formProps: {
    location: Location;
    locationTypes: Array<LocationType>;
  };
};

const EditLocationModal = ({ formProps }: LocationFormProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const router = useRouter();

  async function onSubmit(data) {
    setIsLoading(true);

    const formData = data;

    try {
      const response = await fetch(`/api/locations/${formProps.location.id}`, {
        method: "PUT",
        body: new URLSearchParams(formData),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      const data = await response.json();

      if (!data.success) {
        toast(true, data.error.message);
      } else {
        toast(false, "Catégorie modifiée avec succès");
        document
          .getElementById(`close-modal-edit-${formProps.location.id}`)
          .click();
        revalidate("/dashboard/locations");
        router.push("/dashboard/locations");
      }
    } catch (error) {
      toast(true, error.message);
    } finally {
      setIsLoading(false);
    }
  }

  const options = formProps.locationTypes.map((locationType) => ({
    value: locationType.id,
    label: locationType.name,
    icon: locationType.icon,
  }));

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: formProps.location.name,
      description: formProps.location.description,
      locationTypeId: formProps.location.locationTypeId,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="modal" id={"modal-edit-" + formProps.location.id}>
        <div className="modal-dialog modal-lg" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">&Eacute;diter l&apos;emplacement</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label required" htmlFor="name">
                  Nom
                </label>
                <input
                  id="name"
                  type="text"
                  className={clsx("form-control", errors.name && "is-invalid")}
                  placeholder="Lot A1"
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

              <div className="mb-3">
                <label className="form-label required">Catégorie</label>
                <Controller
                  control={control}
                  defaultValue={formProps.location.locationTypeId}
                  name="locationTypeId"
                  render={({ field }) => (
                    <Select
                      onChange={(val) => field.onChange(val.value)}
                      options={options}
                      placeholder="Sélectionner"
                      styles={selectStyle}
                      value={options.find((c) => c.value === field.value)}
                      components={{ Option: IconOption }}
                    />
                  )}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  rows={3}
                  placeholder="Stock contenu dans la salle à droite de l'accueil. Sous cadenas, code 1337."
                  {...register("description")}
                ></textarea>
              </div>
            </div>
            <div className="modal-footer">
              <a
                href="#"
                className="btn btn-link link-secondary"
                id={"close-modal-edit-" + formProps.location.id}
                data-bs-dismiss="modal"
              >
                Annuler
              </a>
              <button
                type="submit"
                className={clsx(
                  "btn btn-primary ms-auto",
                  isLoading && "btn-loading",
                )}
                disabled={isLoading}
              >
                <IconEdit className="icon" />
                Sauvegarder
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default EditLocationModal;
