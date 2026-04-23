const Card = ({ children, className }) => {
  return (
    <div className={`bg-surface p-6 rounded-lg shadow-md ${className}`}>
      {children}
    </div>
  );
};

export default Card;
