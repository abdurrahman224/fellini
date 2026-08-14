const PrimaryButton = ({ children, onClick, type = 'submit', className = '', disabled = false }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`rounded  bg-[#7C3AED] px-6 py-3 text-base font-normal text-[#FFFBFB] transition-all duration-200 hover:bg-[#6D28D9] hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[#7C3AED] disabled:hover:shadow-none disabled:hover:scale-100 md:px-8 md:py-3.5 ${className}`}
    >
      {children}
    </button>
  );
};

export default PrimaryButton;
