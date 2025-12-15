import Link from "next/link"
import type { ReactElement } from "react"
import type { Category } from "../types"
import styles from "./CategoryGrid.module.css"
import CarIcon from "./icons/CarIcon"
import HomeIcon from "./icons/HomeIcon"
import PhoneIcon from "./icons/PhoneIcon"
import LaptopIcon from "./icons/LaptopIcon"
import SofaIcon from "./icons/SofaIcon"
import BabyIcon from "./icons/BabyIcon"
import SportsIcon from "./icons/SportsIcon"
import HobbyIcon from "./icons/HobbyIcon"
import BriefcaseIcon from "./icons/BriefcaseIcon"
import ShirtIcon from "./icons/ShirtIcon"
import WrenchIcon from "./icons/WrenchIcon"
import PetIcon from "./icons/PetIcon"
import DefaultIcon from "./icons/DefaultIcon"

interface CategoryGridProps {
  categories: Category[]
}

const categoryIcons: Record<string, ReactElement> = {
  car: <CarIcon />,
  vehicles: <CarIcon />,
  home: <HomeIcon />,
  properties: <HomeIcon />,
  phone: <PhoneIcon />,
  mobiles: <PhoneIcon />,
  laptop: <LaptopIcon />,
  electronics: <LaptopIcon />,
  sofa: <SofaIcon />,
  furniture: <SofaIcon />,
  baby: <BabyIcon />,
  kids: <BabyIcon />,
  sports: <SportsIcon />,
  hobby: <HobbyIcon />,
  hobbies: <HobbyIcon />,
  briefcase: <BriefcaseIcon />,
  jobs: <BriefcaseIcon />,
  shirt: <ShirtIcon />,
  fashion: <ShirtIcon />,
  wrench: <WrenchIcon />,
  services: <WrenchIcon />,
  pet: <PetIcon />,
  pets: <PetIcon />,
}

function getIconForCategory(category: Category): ReactElement {
  const iconKey = category.icon || category.slug || category.name.toLowerCase()

  for (const [key, icon] of Object.entries(categoryIcons)) {
    if (iconKey.includes(key)) {
      return icon
    }
  }

  return <DefaultIcon />
}

export default function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <div className={styles.grid}>
      {categories.map((category) => (
        <Link key={category.id} href={`/category/${category.slug || category.id}`} className={styles.categoryCard}>
          <div className={styles.iconWrapper}>{getIconForCategory(category)}</div>
          <span className={styles.categoryName}>{category.name}</span>
        </Link>
      ))}
    </div>
  )
}
