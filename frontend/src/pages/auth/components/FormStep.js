import React from "react";
import FormField from "./FormField";

function FormStep({ fields, data, onChange, onNext, onBack, isLastStep }) {
    return (
      <form>
        {fields.map((field) =>
          field.type === "custom" ? (
            <field.component
              key={field.id}
              value={data[field.id]}
              onChange={(e) => onChange({ ...data, [field.id]: e.target.value })}
              required={field.required}
            />
          ) : (
            <FormField
              key={field.id}
              id={field.id}
              label={field.label}
              type={field.type}
              value={data[field.id]}
              onChange={(e) => onChange({ ...data, [field.id]: e.target.value })}
              options={field.options || []}
              required={field.required}
            />
          )
        )}
        <div className="d-flex justify-content-between">
          {onBack && <button type="button" className="btn btn-secondary" onClick={onBack}>Back</button>}
          <button
            type="button"
            className="btn btn-primary"
            onClick={onNext}
          >
            {isLastStep ? "Submit" : "Next"}
          </button>
        </div>
      </form>
    );
  }  

export default FormStep;