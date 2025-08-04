import { useState, Fragment, useEffect } from "react";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import { menuCategories, menuCategoryChildren } from "./constant";
import { Eye, EyeOff } from "lucide-react";
import useStyles from "./style";

const EventPreparationPage = () => {
  const classes = useStyles();

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Add "All" option to categories
  const allCategory = { id: null, name: "All" };
  const categoriesWithAll = [allCategory, ...menuCategories];
  const filteredCategories = categoriesWithAll.filter(({ name }) =>
    name.toLowerCase().includes(search.toLowerCase())
  );

  // State for selected children (multi-select)
  const [selectedChildren, setSelectedChildren] = useState([]);
  const [childSearch, setChildSearch] = useState("");

  const [showDetails, setShowDetails] = useState(false);
  const [rate, setRate] = useState(0);

  // Filter children by selected category and child search
  const filteredChildren = menuCategoryChildren.filter(
    (child) =>
      (!selectedCategory || child.parentId === selectedCategory) &&
      child.name.toLowerCase().includes(childSearch.toLowerCase())
  );

  // Toggle child selection
  const toggleChildSelection = (id) => {
    setSelectedChildren((prev) =>
      prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id]
    );
  };

  // Helper: Group selected items by category
  const selectedItems = selectedChildren
    .map((id) => menuCategoryChildren.find((c) => c.id === id))
    .filter(Boolean);

  const selectedItemsByCategory = selectedItems.reduce((acc, item) => {
    const category = menuCategories.find((cat) => cat.id === item.parentId);
    const categoryName = category ? category.name : "Other";
    if (!acc[categoryName]) acc[categoryName] = [];
    acc[categoryName].push(item);
    return acc;
  }, {});

  // State for notes and per-item price
  const [itemNotes, setItemNotes] = useState({});
  const [itemRates, setItemRates] = useState({});

  // Handler for note change
  const handleNoteChange = (id, note) => {
    setItemNotes((prev) => ({ ...prev, [id]: note }));
  };

  // Handler for per-item rate change
  const handleItemRateChange = (id, value) => {
    setItemRates((prev) => ({ ...prev, [id]: value }));
  };

  // Calculate total price (per item or fallback to global rate)
  const totalPrice = selectedItems.reduce(
    (sum, item) =>
      sum + (Number(itemRates[item.id]) || Number(rate) || 0) * 300,
    0
  );

  return (
    <Fragment>
      <Container>
        {/* Breadcrumbs */}
        <div className="gap-2 pb-2 mb-3">
          <Breadcrumbs items={[{ title: "Menu Preparation" }]} />
        </div>
        <div
          className={`grid grid-cols-11 lg:grid-cols-11 border rounded-lg gap-4 p-4 ${classes.customStyle}`}
        >
          {/* Sidebar: Categories */}
          <div className="col-span-2 border rounded-lg h-96 flex flex-col bg-gray-50">
            <input
              type="text"
              placeholder="Search categories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="mb-2 p-2 border rounded text-xs focus:outline-none"
            />
            <div
              className="flex-1 overflow-y-auto"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              <style>
                {`
                  .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                  }
                `}
              </style>
              <div className="hide-scrollbar h-full">
                {filteredCategories.length === 0 ? (
                  <div className="p-2 text-gray-400 text-xs">
                    No categories found
                  </div>
                ) : (
                  filteredCategories.map(({ name, id }) => (
                    <button
                      key={id}
                      onClick={() => setSelectedCategory(id)}
                      className={`w-full text-left p-2 border-b last:border-b-0 rounded transition-colors text-xs ${
                        selectedCategory === id
                          ? "bg-blue-50 text-blue-700 font-medium"
                          : "hover:bg-gray-100 text-gray-700"
                      }`}
                    >
                      {name}
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>
          {/* Children: Square Box Grid, 5 per row */}
          <div className="col-span-6 space-y-4 rounded-lg h-96 flex flex-col">
            <input
              type="text"
              placeholder="Search items..."
              value={childSearch}
              onChange={(e) => setChildSearch(e.target.value)}
              className="mb-2 p-2 border rounded text-xs focus:outline-none"
            />
            <div className="flex-1 overflow-y-auto hide-scrollbar">
              {filteredChildren.length === 0 ? (
                <div className="p-2 text-gray-400 text-xs">No items found</div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {filteredChildren.map(({ parentId, id, name, image }) => (
                    <div
                      key={id}
                      className={`flex flex-col items-center justify-center p-2 border rounded-lg cursor-pointer aspect-square transition-all ${
                        selectedChildren.includes(id)
                          ? "bg-blue-100 border-blue-400"
                          : "hover:bg-gray-100"
                      }`}
                      onClick={() => toggleChildSelection(id)}
                    >
                      <div className="w-16 h-16 mb-2 flex items-center justify-center">
                        <img
                          src={image}
                          alt={name}
                          className="w-full h-full object-cover rounded border"
                        />
                      </div>
                      <div className="font-medium text-center text-xs">
                        {name}
                      </div>
                      {selectedChildren.includes(id) && (
                        <span className="text-blue-600 text-lg font-bold mt-1">
                          &#10003;
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          {/* Selected Items Summary */}
          <div className="col-span-3 flex flex-col h-96 border rounded-lg bg-gray-50 p-2">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-sm">Selected Items</span>
              <button
                className="text-primary hover:underline"
                onClick={() => setShowDetails((prev) => !prev)}
              >
                {showDetails ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
            </div>
            {/* Details (Person, Date, Rate, Price) */}

            <div className="mb-2 space-y-1 text-xs">
              <div>
                <span className="font-medium">Person:</span>
                <input
                  type="number"
                  min={1}
                  value={300}
                  readOnly
                  className="ml-2 w-20 p-1 border rounded text-xs bg-gray-100"
                />
              </div>
              <div>
                <span className="font-medium">Date &amp; Time:</span>{" "}
                <input
                  type="text"
                  value="27/07/2025 11:00 AM"
                  readOnly
                  className="ml-2 w-36 p-1 border rounded text-xs bg-gray-100"
                />
              </div>
              <div>
                <span className="font-medium">Default Rate:</span>
                <input
                  type="number"
                  value={rate}
                  onChange={(e) => setRate(e.target.value)}
                  className="ml-2 w-20 p-1 border rounded text-xs"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto hide-scrollbar">
              {selectedChildren.length === 0 ? (
                <div className="text-xs text-gray-400 p-2">
                  No items selected
                </div>
              ) : (
                <div className="space-y-2">
                  {Object.entries(selectedItemsByCategory).map(
                    ([categoryName, items]) => (
                      <div key={categoryName} className="mb-2">
                        <div className="font-semibold text-xs text-blue-700 mb-1">
                          {categoryName}
                        </div>
                        <ul className="space-y-2">
                          {items.map((item) => (
                            <li
                              key={item.id}
                              className="flex flex-col bg-white rounded border p-2 shadow-sm"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-8 h-8 object-cover rounded border"
                                  />
                                  <span className="text-xs font-medium">
                                    {item.name}
                                  </span>
                                </div>
                                <button
                                  className="ml-2 text-gray-400 hover:text-red-500"
                                  title="Remove"
                                  onClick={() =>
                                    setSelectedChildren((prev) =>
                                      prev.filter((cid) => cid !== item.id)
                                    )
                                  }
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M6 18L18 6M6 6l12 12"
                                    />
                                  </svg>
                                </button>
                              </div>
                              {showDetails && (
                                <div className="flex items-center mt-1 gap-2">
                                  <span className="text-xs text-gray-500">
                                    Rate:
                                  </span>
                                  <input
                                    type="number"
                                    value={itemRates[item.id] || rate}
                                    onChange={(e) =>
                                      handleItemRateChange(
                                        item.id,
                                        e.target.value
                                      )
                                    }
                                    className="w-16 p-1 border rounded text-xs"
                                    min={0}
                                  />
                                  <span className="text-xs text-gray-500">
                                    Price:
                                  </span>
                                  <span className="font-semibold text-xs">
                                    ₹{" "}
                                    {(Number(itemRates[item.id]) ||
                                      Number(rate) ||
                                      0) * 300}
                                  </span>
                                </div>
                              )}
                              <div className="mt-1">
                                <textarea
                                  placeholder="Add note..."
                                  value={itemNotes[item.id] || ""}
                                  onChange={(e) =>
                                    handleNoteChange(item.id, e.target.value)
                                  }
                                  className="w-full p-1 border rounded text-xs mt-1 resize-none"
                                  rows={1}
                                />
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
            <div className="pt-2 border-t mt-2 text-xs text-gray-600 flex justify-between">
              <span>Total Items:</span>
              <span className="font-semibold">{selectedChildren.length}</span>
            </div>
            {/* Show price only when showDetails is false */}
            {showDetails && (
              <div className="pt-1 text-xs text-gray-700 flex justify-between font-semibold">
                <span>Total:</span>
                <span>₹ {totalPrice}</span>
              </div>
            )}
          </div>
        </div>
      </Container>
    </Fragment>
  );
};
export default EventPreparationPage;
