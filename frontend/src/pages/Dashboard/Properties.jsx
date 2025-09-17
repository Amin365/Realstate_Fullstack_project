import { useState } from "react";
import PropertyForm from "../../components/properties/ProprtyForm";
import ProperHeader from "../../components/properties/properHeader";
import PropertyTable from "../../components/properties/propertyTable";

function Properties() {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);

  // Open form for add or edit
  const handleOpenDialog = (property = null) => {
    setSelectedProperty(property); // null for add, object for edit
    setOpenDialog(true);
  };

  return (
    <div className="p-4">
      {/* Header with Add button */}
      <ProperHeader onOpenChange={() => handleOpenDialog(null)} />

      {/* Property table */}
      <PropertyTable
        onEdit={handleOpenDialog} // send edit callback
      />

      {/* Add/Edit Property Form */}
      <PropertyForm
        open={openDialog}
        onOpenChange={setOpenDialog}
        property={selectedProperty} // pass selected property
      />
    </div>
  );
}

export default Properties;
