import Rating from "@/components/reusable/Rating";
import CarWashServiceList from "@/components/service/CarWashServiceList";
import { ImageUrl } from "@/config/app.config";
import { UserService } from "@/service/user/user.service";
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { MdOutlineArrowForwardIos } from "react-icons/md";

async function ServiceDetailsPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const { id } = params;
  const cookieStore = await cookies()
  const token = cookieStore?.get("cartoken")?.value;
  if (!token) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Link href="/login" className="text-xl underline text-primaryColor text-center">Please log in to view the dashboard</Link>
      </div>
    );
  }
  const response = await UserService.getSingleService(token, id)
  const singleCar = await response?.data?.data
  
  
  const serviceDetails = [
    { icon: "/icon/caricon.svg", label: singleCar?.category },
    { icon: "/icon/maps-location-01.svg", label: singleCar?.location },
    { icon: "/icon/ptime.svg", label: singleCar?.available_time },
  ];

  return (
    <div>
      <div className="flex gap-4 items-center">
        <Link
          href="/dashboard/services"
          className="text-blackColor font-semibold text-xl lg:text-2xl"
        >
          Our Services
        </Link>{" "}
        <MdOutlineArrowForwardIos className=" text-xl lg:text-2xl" />
        <p className="text-blackColor font-semibold text-xl lg:text-2xl">
          {singleCar?.category}
        </p>
      </div>
      <div className="lg:px-5 pt-6">
        <div className=" h-[350px] w-full">
          <Image
           src={`${ImageUrl}${singleCar.image}`}
            alt="car image"
            width={1200}
            height={500}
            className="rounded-md  w-full h-full object-cover"
          />
        </div>
        <div className=" grid grid-cols-2 md:grid-cols-3 mt-8">
          <div className="md:col-span-2">
            <h4 className=" text-lg font-medium text-headerColor ">
              {singleCar?.name}
            </h4>
            <p className="text-pragaraphColor text-base">{singleCar?.category}</p>
            <Rating ratings={5} />
          </div>
          <div className="md:col-span-1">
            <div className="md:space-y-4 space-y-3">
              {serviceDetails.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div>
                    <Image
                      src={item?.icon}
                      alt={item?.label}
                      width={17}
                      height={16}
                      className=""
                    />
                  </div>
                  <span className="text-base text-pragaraphColor">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-8 mb-11">
          <h3 className=" text-lg font-semibold text-headerColor ">
            About the Provider
          </h3>
          <p className="text-base text-pragaraphColor mt-0.5">
            {singleCar?.description}
          </p>
        </div>

        <div className="md:flex space-y-3 md:space-y-0 gap-4 items-center">
          <div className="flex  items-center gap-2">
            <Image
              src="/icon/user.svg"
              alt="user"
              width={18}
              height={18}
              className=""
            />
            <p className="text-base text-secondaryColor">
              <span>Team Size:</span> {singleCar?.team_size}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Image
              src="/icon/car-2.svg"
              alt="user"
              width={18}
              height={18}
              className=""
            />
            <p className="text-base text-secondaryColor">
              <span>Mobile:</span> {singleCar?.is_mobile?  "Available" : "No Available"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Image
              src="/icon/home.svg"
              alt="user"
              width={18}
              height={18}
              className=""
            />
            <p className="text-base text-secondaryColor">
              <span>Garage:</span> {singleCar?.is_garage?  "Available" : "No Available"}
            </p>
          </div>
        </div>
      </div>
      <div className="mt-8">

        <CarWashServiceList/>
      </div>
    </div>
  );
}

export default ServiceDetailsPage;
