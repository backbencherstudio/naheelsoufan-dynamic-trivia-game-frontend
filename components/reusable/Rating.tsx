import { FaStar, FaStarHalf } from "react-icons/fa6";

function Rating({ ratings = 5 }: any) {
  return (
    <div className=" flex gap-2 items-center">
      <div className="flex gap-1 text-yellow-400 ">
        {Array.from({ length: 5 }).map((_, index) => {
          const rating = ratings || 0;
          if (rating >= index + 1) {
            return <FaStar key={index} className=" text-base" />;
          } else if (rating >= index + 0.5) {
            return (
              <div className="relative">
                <FaStar
                  key={index}
                  className=" text-base text-gray-300"
                />
                <FaStarHalf
                  key={index}
                  className=" text-base absolute top-0 left-0"
                />
              </div>
            );
          } else {
            return (
              <FaStar
                key={index}
                className="xl:text-5xl text-base text-gray-300"
              />
            );
          }
        })}
      </div>
      <div className=" text-base font-medium text-descriptionColor">
        {ratings.toFixed(2)}
      </div>
    </div>
  );
}

export default Rating;
