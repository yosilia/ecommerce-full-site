
import React from "react";
import styled from "styled-components";

// A container for the three columns
const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 28px;
`;

// A simple container for each column
const Column = styled.div``;

// Section header for each column
const SectionHeader = styled.h4`
  font-size: 1rem;
  font-weight: bold;
  margin-bottom: 8px;
`;

// A label for each input field
const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  margin-bottom: 4px;
`;

// Styled input field (reuse or modify as needed)
const InputField = styled.input`
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 14px;
  font-family: "Lora", serif;
  text-align: center;
`;

export default function MeasurementsSection({ measurements, setMeasurements, groups }) {
  // Group 1: Men Body Measurements
  const measurementFieldsMen = {
    top: [
      { name: "topLength", label: "Top Length" },
      { name: "topBack", label: "Top Back" },
      { name: "sleeve", label: "Sleeve" },
      { name: "sleeveCircumference", label: "Sleeve Circumference" },
      { name: "chest", label: "Chest" },
      { name: "waist", label: "Waist" },
      { name: "topHip", label: "Top Hip" },
      { name: "neck", label: "Neck" },
    ],
    trouser: [
      { name: "trouserLength", label: "Trouser Length" },
      { name: "trouserHip", label: "Trouser Hip" },
      { name: "thigh", label: "Thigh" },
      { name: "bottom", label: "Bottom" },
    ],
  };
  
  

  // Group 2: Dress & Blouse Measurements
  const measurementFieldsDress = [
    { name: "dressLength", label: "Dress Length – From the shoulder down to the desired length" },
    { name: "backLength", label: "Back Length – From the base of the neck to the waistline" },
    { name: "sleeveLength", label: "Sleeve Length – From shoulder to wrist (or desired length)" },
    { name: "roundSleeve", label: "Round Sleeve – Around the upper arm at the widest part" },
    { name: "nippleToNipple", label: "Nipple to Nipple – Distance between both nipples" },
    { name: "shoulderToNipple", label: "Shoulder to Nipple – From shoulder down to the nipple" },
    { name: "halfLength", label: "Half Length – From the shoulder to the waist" },
    { name: "cleavageDepth", label: "Cleavage Depth – From the base of the neck to the desired cleavage point" },
    { name: "blouseLength", label: "Blouse Length – From the shoulder down to the desired blouse length" },
  ];

  // Group 3: Skirt & Trouser Measurements
  const measurementFieldsSkirtTrouser = [
    { name: "skirtLength", label: "Skirt Length – From the waist to the desired length" },
    { name: "trouserLength", label: "Trouser Length – From the waist to the ankle (or desired length)" },
    { name: "trouserThigh", label: "Thigh (Trousers) – Around the fullest part of the thigh" },
    { name: "trouserBottom", label: "Bottom/Hem (Trousers) – Around the ankle or desired hem width" },
  ];

  // Helper function to render inputs based on field definitions
  const renderFields = (fields) =>
    fields.map((field) => (
      <div key={field.name}>
        <InputField
          type="text"
          placeholder={field.label}
          value={measurements[field.name] || ""}
          onChange={(e) =>
            setMeasurements((prev) => ({ ...prev, [field.name]: e.target.value }))
          }
        />
      </div>
    ));

  return (
    <GridContainer>
      <Column>
        <SectionHeader>Mens Top </SectionHeader>
        {renderFields(measurementFieldsMen.top)}
      </Column>
      <Column>
      <SectionHeader>Mens Trousers</SectionHeader>
      {renderFields(measurementFieldsMen.trouser)}
      </Column>
      <Column>
        <SectionHeader>Ladies Dress & Blouse </SectionHeader>
        {renderFields(measurementFieldsDress)}
      </Column>
      <Column>
        <SectionHeader>Ladies Skirt & Trouser </SectionHeader>
        {renderFields(measurementFieldsSkirtTrouser)}
      </Column>
    </GridContainer>
  );
}


