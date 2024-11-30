function FormField({ id, label, type, value, onChange, options = [], required = true }) {
  return (
    <div className="mb-3">
      <label htmlFor={id} className="form-label">
        {label}
        {required && <span style={{ color: "red" }}> *</span>}
      </label>
      {type === "select" ? (
        <select
          id={id}
          name={id}
          className="form-select"
          value={value}
          onChange={onChange}
          required={required}
        >
          <option value="" disabled>
            Select {label.toLowerCase()}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          className="form-control"
          id={id}
          name={id}
          value={value}
          onChange={onChange}
          required={required}
        />
      )}
    </div>
  );
}

export default FormField;
