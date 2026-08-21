import Header from "../assets/components/Header";
// import Signup from "../assets/components/Signup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShieldHalved , faUserGroup} from "@fortawesome/free-solid-svg-icons";
import { faBuilding } from '@fortawesome/free-regular-svg-icons';
import Footer from "../assets/components/Footer";


export default function Index() {
  return (
    <>
      <Header />
      <div className="flex flex-col gap-7 min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="sm:text-1xl md:text-1xl text-[var(--color-primary)]">
            <FontAwesomeIcon icon={faShieldHalved} size="lg" /> Secure,
            Scalable, Built for Teams.
          </p>

          <h1 className="mx-auto mt-4 max-w-[600px] sm:text-4xl md:text-5xl font-extrabold text-black">
            Multi-Tenant Access Made Simple.
          </h1>
          <p className="sm:text-1xl mx-auto mt-4 max-w-[600px] text-[#7a7d84]">
            Manage organizations, workspaces, members, and permissions from one
            secure control plane.
          </p>
          <div className="mt-5 flex items-center justify-center gap-12">
            <a href="/signup" className="btn-primary px-5 py-2">
              Get Started{" "}
              <span className="text-lg font-extrabold leading-none ">→</span>
            </a>

            <a
              href="/login"
              className="btn-secondary group text-[#67696e] hover:text-white"
            >
              Login{" "}
              <span className=" text-xl font-extrabold l text-[#2060e0] transition-color  group-hover:text-white -mt-0.1">
                →
              </span>
            </a>
          </div>
        </div>

        {/* features */}
<div className="mt-7 flex flex-col items-center justify-center gap-6 sm:flex-row sm:flex-wrap lg:gap-8">
  
  <div className="w-[280px] min-h-48 rounded-lg border border-gray-300 p-6 text-center container-shadow">
    <h1 className="mb-3 font-extrabold text-[var(--color-primary)]">
      <FontAwesomeIcon icon={faBuilding} size="lg" />
    </h1>

    <h2 className="mt-2 mb-2 font-bold">
      Organizations Access
    </h2>

    <p className="mt-2 text-[#7a7d84]">
      Manage company-level membership and roles.
    </p>
  </div>

  <div className="w-[280px] min-h-48 rounded-lg border border-gray-300 p-6 text-center container-shadow">
    <h1 className="mb-3 font-extrabold text-[var(--color-primary)]">
      <FontAwesomeIcon icon={faUserGroup} size="lg" />
    </h1>

    <h2 className="mt-2 mb-2 font-bold">
      Workspace
    </h2>

    <p className="mt-2 text-[#7a7d84]">
      Control access to specific teams and projects.
    </p>
  </div>

  <div className="w-[280px] min-h-48 rounded-lg border border-gray-300 p-6 text-center container-shadow">
    <h1 className="mb-3 font-extrabold text-[var(--color-primary)]">
      <FontAwesomeIcon icon={faBuilding} size="lg" />
    </h1>

    <h2 className="mt-2 mb-2 font-bold">
      Permissions
    </h2>

    <p className="mt-2 text-[#7a7d84]">
      Define what users can actually do.
    </p>
  </div>

</div>
      </div>
      {/* How it works / Why RoleBase */}
<section className="w-full px-6 py-10">
  <div className="mx-auto max-w-5xl text-center ">

 <h2 className="mt sm:text-3xl md:text-3xl  font-extrabold text-black sm:text-4xl">
      Everything You Need to Manage Access
    </h2>

    <p className="mx-auto mt-4 max-w-2xl text-[#7a7d84] ">
      RoleBase gives your team a centralized way to manage users, roles,
      workspaces, and permissions without unnecessary complexity.
    </p>

    <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
      <div className="container-shadow rounded-lg border border-gray-300 p-6 text-left">
        <h2 className="font-bold text-black text-center">
          Centralized Control
        </h2>
        <p className="mt-2 text-sm leading-6 text-[#7a7d84] text-center">
          Manage your organizations, members, and access rules from one
          secure control plane.
        </p>
      </div>

      <div className="container-shadow rounded-lg border border-gray-300 p-6 text-left">
        <h2 className="font-bold text-black text-center">
          Role-Based Access
        </h2>
        <p className="mt-2 text-sm leading-6 text-[#7a7d84] text-center">
          Define clear roles and permissions so every user gets the access
          they need.
        </p>
      </div>

      <div className="container-shadow rounded-lg border border-gray-300 p-6 text-left">
        <h2 className="font-bold text-black text-center">
          Built to Scale
        </h2>
        <p className="mt-2 text-sm leading-6 text-[#7a7d84] text-center">
          Keep access management simple as your teams, workspaces, and
          organizations grow.
        </p>
      </div>
    </div>
  </div>
</section>
<Footer/>
    </>
  );
}
