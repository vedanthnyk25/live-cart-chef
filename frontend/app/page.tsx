import GridOption from "@/components/GridOption";


export default function Home() {
  return (
    <main className="flex-1">
      <div className="grid grid-cols-1 grid-flow-row-dense md:grid-cols-4 gap-6 m-6">
      <GridOption
        title="Sweet gifts for less"
        image="/Sweetgifts.jfif"
        className="bg-pink-200 h-full md:h-32 max-sm:col-span-2"
      />

        <GridOption
          title="Shop Wardrobe"
          image="/wardrob.webp"
          className="bg-blue-100 col-span-2 row-span-2"
        />

        <GridOption
          title="Shop Home"
          image="/ShopHome.webp"
          className="bg-pink-200 row-span-2"
        />
        <GridOption
          title="Shop Electronics"
          image="/ShopElectronics.jpeg"
          className="bg-yellow-100 h-64"
        />
        
        <GridOption
          title="Shop Toys"
          image="/ShopToys.jpeg"
          className="bg-green-100 h-64 col-span-2"
        />

        <GridOption
          title="All you need for Match Day"
          image="/MatchDay.jpeg"
          className="bg-red-100 col-pan-2 row-span-2"
         />

        <GridOption
          title="Shop Gadgets"
          image="/ShopGadgets.jpeg"
          className="bg-orange-100 h-64"
        />

        <GridOption
          title="Shop Beauty"
          image="/ShopBeauty.webp" 
          className="bg-blue-100 h-64"
        />
        <GridOption
          title="Shop Sports"
          image="/ShopSports.jpeg"
          className="bg-blue-100 h-64"
         />

          <GridOption
            title="Enjoy Free Shipping"
            image="/EnjoyFreeShipping.jfif"
            className="bg-rose-100 h-64 max-sm:col-span-2"
           />
          <GridOption
            title="Flash Deals"
            image="/FlashDeals.jpeg"
            className="bg-orange-200 h-64 col-span-2 xl:col-span-4"
          />
      </div>
    </main>
  );
}
