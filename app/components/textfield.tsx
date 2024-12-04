interface FormFieldProps {
    htmlFor: string;
    label: string;
    type?: string;
    value: string;
    onChange?: (...args: any) => any;
    required?: boolean;  // Dodanie typu required
  }
  
  export function Textfield({ htmlFor, label, type = 'text', value, onChange = () => {}, required = false }: FormFieldProps) {
    return (
      <>
        <label htmlFor={htmlFor} className="text-gray-600 font-semibold">
          {label}
        </label>
        <input
          onChange={onChange}
          type={type}
          id={htmlFor}
          name={htmlFor}
          className="w-full p-2 rounded-xl my-2 border border-gray-300"
          value={value}
          required={required}  // Dodanie atrybutu required
        />
      </>
    );
  }