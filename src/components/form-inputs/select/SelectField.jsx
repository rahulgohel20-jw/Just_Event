import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { ChevronDown, Loader2, X } from "lucide-react";

const SelectField = ({
  label,
  icon: Icon,
  iconColorClass = "bg-primary-clarity text-primary",
  options = [],
  getOptionLabel = (opt) => opt.label ?? opt.nameEnglish ?? String(opt),
  getOptionValue = (opt) => opt.value ?? opt.id,
  value,
  onChange,
  onBlur,
  error,
  touched,
  loading = false,
  disabled = false,
  loadingText = "Loading...",
  disabledText,
  placeholder = "Search...",
  emptyText = "No results found",
  required = false,
  clearable = true,
  className,
}) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  const isDisabled = disabled || loading;
  const hasError = Boolean(touched && error);
  const hasValue = value !== undefined && value !== null && value !== "";

  const selectedOption = options.find(
    (opt) => String(getOptionValue(opt)) === String(value)
  );
  const selectedLabel = selectedOption ? getOptionLabel(selectedOption) : "";
  const displayValue = open ? query : selectedLabel;

  const filteredOptions = query.trim()
    ? options.filter((opt) =>
        getOptionLabel(opt).toLowerCase().includes(query.trim().toLowerCase())
      )
    : options;

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
        setQuery("");
        setHighlightedIndex(-1);
        onBlur?.();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, onBlur]);

  useEffect(() => {
    setHighlightedIndex(-1);
  }, [query, open]);

  useEffect(() => {
    if (highlightedIndex < 0 || !listRef.current) return;
    const item = listRef.current.children[highlightedIndex];
    item?.scrollIntoView({ block: "nearest" });
  }, [highlightedIndex]);

  const handleFocus = () => {
    if (isDisabled) return;
    setOpen(true);
    setQuery("");
  };

  const handleInputChange = (e) => {
    setQuery(e.target.value);
    if (!open) setOpen(true);
  };

  const handleSelect = (opt) => {
    onChange?.(getOptionValue(opt));
    setOpen(false);
    setQuery("");
    setHighlightedIndex(-1);
    onBlur?.();
    inputRef.current?.blur();
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange?.("");
    setQuery("");
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (isDisabled) return;

    if (!open && (e.key === "ArrowDown" || e.key === "Enter")) {
      setOpen(true);
      return;
    }
    if (!open) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev < filteredOptions.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev > 0 ? prev - 1 : filteredOptions.length - 1
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
        handleSelect(filteredOptions[highlightedIndex]);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
      setQuery("");
      inputRef.current?.blur();
    }
  };

  return (
    <div className="flex flex-col gap-1.5" ref={containerRef}>
      {label && (
        <label className="text-sm font-medium text-gray-800">
          {label}
          {required && <span className="text-danger ml-0.5">*</span>}
        </label>
      )}

      <div className="relative">
        <div
          className={clsx(
            "w-full h-12 pl-3 pr-16 rounded-xl border bg-white flex items-center gap-2.5",
            "transition-colors",
            isDisabled && "bg-gray-50 cursor-not-allowed",
            hasError
              ? "border-danger"
              : open
              ? "border-primary ring-2 ring-primary-clarity"
              : "border-gray-200 hover:border-gray-300"
          )}
        >
          {Icon && (
            <span
              className={clsx(
                "flex items-center justify-center size-7 rounded-full shrink-0",
                iconColorClass
              )}
            >
              <Icon size={15} />
            </span>
          )}
          <input
            ref={inputRef}
            type="text"
            role="combobox"
            aria-expanded={open}
            aria-autocomplete="list"
            value={loading ? loadingText : isDisabled && disabledText ? disabledText : displayValue}
            onChange={handleInputChange}
            onFocus={handleFocus}
            onKeyDown={handleKeyDown}
            disabled={isDisabled}
            placeholder={placeholder}
            className={clsx(
              "w-full text-sm outline-none bg-transparent truncate",
              "placeholder:text-gray-400 disabled:text-gray-400 disabled:cursor-not-allowed",
              className
            )}
          />
        </div>

        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {clearable && hasValue && !isDisabled && (
            <button
              type="button"
              onClick={handleClear}
              className="flex items-center justify-center size-5 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              aria-label="Clear"
            >
              <X size={13} />
            </button>
          )}
          {loading ? (
            <Loader2 size={16} className="text-gray-400 animate-spin pointer-events-none" />
          ) : (
            <ChevronDown
              size={16}
              className={clsx(
                "text-gray-500 pointer-events-none transition-transform",
                open && "rotate-180"
              )}
            />
          )}
        </div>

        {open && !isDisabled && (
          <div className="absolute z-20 mt-2 w-full rounded-xl border border-gray-200 bg-white shadow-lg overflow-hidden">
            <ul ref={listRef} className="max-h-60 overflow-y-auto py-1.5 pr-1">
              {filteredOptions.length === 0 ? (
                <li className="px-4 py-2.5 text-sm text-gray-400">{emptyText}</li>
              ) : (
                filteredOptions.map((opt, index) => {
                  const optValue = getOptionValue(opt);
                  const isSelected = String(optValue) === String(value);
                  const isHighlighted = index === highlightedIndex;
                  return (
                    <li key={optValue}>
                      <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onMouseEnter={() => setHighlightedIndex(index)}
                        onClick={() => handleSelect(opt)}
                        className={clsx(
                          "w-full text-left px-4 py-2.5 text-sm font-medium transition-colors",
                          isSelected
                            ? "bg-primary-clarity text-primary"
                            : isHighlighted
                            ? "bg-gray-50 text-gray-700"
                            : "text-gray-700"
                        )}
                      >
                        {getOptionLabel(opt)}
                      </button>
                    </li>
                  );
                })
              )}
            </ul>
          </div>
        )}
      </div>

      {hasError && (
        <span role="alert" className="text-danger text-xs">
          {error}
        </span>
      )}
    </div>
  );
};

export default SelectField;