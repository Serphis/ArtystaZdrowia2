interface FormFieldProps {
    htmlFor: string;
    label: string;
    type?: string;
    value: string;
    onChange?: (...args: any) => any;
    required?: boolean;
  }
  
  export function Textfield({ htmlFor, label, type = 'text', value, onChange = () => {}, required = false }: FormFieldProps) {
    return (
      <>
        <label htmlFor={htmlFor} className="text-black font-normal tracking-widest">
          {label}
        </label>
        <input
          onChange={onChange}
          type={type}
          id={htmlFor}
          name={htmlFor}
          className="w-full p-1 my-2 rounded-md ring-1 ring-black shadow-md"
          value={value}
          required={required}
        />
      </>
    );
  }