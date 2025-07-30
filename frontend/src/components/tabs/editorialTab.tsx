const EditorialTabComponent = () => {
  return (
    <div className="min-h-screen p-6 bg-[#171c23] text-[#f8f9fa] font-[Inter,sans-serif]">
      <div className="max-w-3xl mx-auto rounded-xl shadow-[0_2px_16px_0_#18181a33]">
        <h2 className="text-[22px] font-semibold mb-6 text-[#67e76e] border-b-2 border-[#24292f] pb-3">
          Editorial
        </h2>
        
        <div className="bg-[#20252c] border border-[#232b36] rounded-lg p-6">
          <p className="text-[15px] leading-relaxed text-[#e5e5f5] mb-4">
            The editorial for this problem is currently <strong className="text-[#70d873]">under development</strong>.
            Please check back later for detailed explanations and solutions.
          </p>
          <p className="text-[12px] text-[#a7adba]">
            In the meantime, you can try solving the problem yourself or browse other problems.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EditorialTabComponent;
