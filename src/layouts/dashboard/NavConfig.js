// component
import Iconify from "../../components/Iconify";

// ----------------------------------------------------------------------

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

const navConfig = [
  {
    title: "Hero Title",
    path: "/hero",
    icon: getIcon("bi:card-heading"),
  },
  {
    title: "Products",
    path: "/products",
    icon: getIcon("fluent-mdl2:product-catalog"),
  },
  {
    title: "Publishers",
    path: "/publishers",
    icon: getIcon("fluent-mdl2:publish-course"),
  },
  {
    title: "Advertisers",
    path: "/advertisers",
    icon: getIcon("ri:advertisement-line"),
  },
  {
    title: "About Us",
    path: "/aboutUs",
    icon: getIcon("mdi:about-circle-outline"),
  },
  {
    title: "Inquiries",
    path: "/inquiries",
    icon: getIcon("material-symbols:contact-page-outline-rounded"),
  },
  {
    title: "FAQ",
    path: "/faq",
    icon: getIcon("mdi:faq"),
  },
  {
    title: "Social Media",
    path: "/socialMedia",
    icon: getIcon("fa6-regular:address-card"),
  },
  {
    title: "Terms and conditions",
    path: "/termsAndCondition",
    icon: getIcon("ic:sharp-library-books"),
  },
  {
    title: "Privacy Policy",
    path: "/privacyPolicy",
    icon: getIcon("ic:sharp-privacy-tip"),
  },
  {
    title: "SEO",
    path: "/seo",
    icon: getIcon("icon-park-outline:seo"),
  },
  {
    title: "Links",
    path: "/links",
    icon: getIcon("ic:baseline-add-link"),
  },
];

export default navConfig;
