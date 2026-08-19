import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { petsApi, medicalRecordsApi, vaccinationsApi } from "../services/api";
import PetProfileHero from "../components/pets/PetProfileHero";
import MedicalVisitTimeline from "../components/medical/MedicalVisitTimeline";
import MedicalRecordModal from "../components/medical/MedicalRecordModal";
import VaccinationTrackerTable from "../components/vaccinations/VaccinationTrackerTable";
import VaccinationModal from "../components/vaccinations/VaccinationModal";
import PetFormModal from "../components/pets/PetFormModal";
import { ArrowLeft, Stethoscope, Syringe } from "lucide-react";

export default function PetProfilePage() {
  const { id } = useParams();
  const [pet, setPet] = useState(null);
  const [records, setRecords] = useState([]);
  const [vaccinations, setVaccinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isEditPetOpen, setIsEditPetOpen] = useState(false);
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [isVaccineModalOpen, setIsVaccineModalOpen] = useState(false);

  const fetchPetData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [petData, recData, vaxData] = await Promise.all([
        petsApi.getPet(id),
        medicalRecordsApi.getPetMedicalRecords(id).catch(() => []),
        vaccinationsApi.getPetVaccinations(id).catch(() => []),
      ]);
      setPet(petData);
      setRecords(recData || []);
      setVaccinations(vaxData || []);
    } catch (err) {
      console.error("Failed to load pet profile:", err);
      setError("Pet profile not found.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPetData();
  }, [id]);

  const handleUpdatePet = async (payload) => {
    await petsApi.updatePet(id, payload);
    fetchPetData();
  };

  const handleCreateRecord = async (recordPayload) => {
    await medicalRecordsApi.createMedicalRecord(recordPayload);
    fetchPetData();
  };

  const handleCreateVaccine = async (vaxPayload) => {
    await vaccinationsApi.createVaccination(vaxPayload);
    fetchPetData();
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center text-slate-500">
        Loading pet profile...
      </div>
    );
  }

  if (error || !pet) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <p className="text-red-600 font-semibold">{error || "Pet not found"}</p>
        <Link
          to="/"
          className="mt-4 inline-flex items-center text-sm font-medium text-blue-600 hover:underline"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const petsMap = { [pet.id]: pet };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <Link
        to="/"
        className="inline-flex items-center text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        <span>Back to Directory</span>
      </Link>

      <PetProfileHero pet={pet} onEdit={() => setIsEditPetOpen(true)} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MedicalVisitTimeline
          records={records}
          onOpenAddRecord={() => setIsRecordModalOpen(true)}
        />

        <VaccinationTrackerTable
          vaccinations={vaccinations}
          petsMap={petsMap}
          onOpenVaccineModal={() => setIsVaccineModalOpen(true)}
        />
      </div>

      <PetFormModal
        isOpen={isEditPetOpen}
        onClose={() => setIsEditPetOpen(false)}
        onSubmit={handleUpdatePet}
        initialData={pet}
      />

      <MedicalRecordModal
        isOpen={isRecordModalOpen}
        onClose={() => setIsRecordModalOpen(false)}
        onSubmit={handleCreateRecord}
        petId={pet.id}
      />

      <VaccinationModal
        isOpen={isVaccineModalOpen}
        onClose={() => setIsVaccineModalOpen(false)}
        onSubmit={handleCreateVaccine}
        pets={[pet]}
      />
    </div>
  );
}
