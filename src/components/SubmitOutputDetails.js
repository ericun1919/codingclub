import React from "react";


const SubmitOutputDetails = ({ submitOutputDetails }) => {
  console.log(submitOutputDetails);
  return (
    <div className='overflow-y-auto h-80 min-h-full'>
      {
      submitOutputDetails.map(d => {
        return (
          <div className="metrics-container mt-4 flex flex-col space-y-3">
            <p className="text-sm">
              Status:{" "}
              <span className="font-semibold px-2 py-1 rounded-md bg-gray-100">
                {d?.status?.description}
              </span>
            </p>
            <p className="text-sm">
              Memory:{" "}
              <span className="font-semibold px-2 py-1 rounded-md bg-gray-100">
                {d?.memory}
              </span>
            </p>
            <p className="text-sm">
              Time:{" "}
              <span className="font-semibold px-2 py-1 rounded-md bg-gray-100">
                {d?.time}
              </span>
            </p>
          </div>
        );
      }
      )
    }
    
    </div>
  );
};

export default SubmitOutputDetails;