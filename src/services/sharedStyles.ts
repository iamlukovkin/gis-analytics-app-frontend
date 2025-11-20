export const autocompleteGlassStyles = {
    "& .MuiOutlinedInput-root": {
        borderRadius: 4,
        m: 0,
        background: "linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0.08))",
        backdropFilter: "blur(16px) saturate(180%)",
        border: "1px solid rgba(255,255,255,0.25)",
        color: "#fff",
        fontSize: "0.875rem",
        transition: "all 0.3s ease",
        boxShadow: "inset 0 1px 2px rgba(0,0,0,0.2)",
        "&:hover": {
            borderColor: "rgba(0,188,212,0.8)",
            background: "linear-gradient(135deg, rgba(255,255,255,0.18), rgba(255,255,255,0.1))",
        },
        "&.Mui-focused": {
            borderColor: "rgba(0,188,212,1)",
            background: "linear-gradient(135deg, rgba(255,255,255,0.22), rgba(255,255,255,0.12))",
            boxShadow: "0 0 8px rgba(0,188,212,0.4) inset",
        },
        "& fieldset": {
            borderColor: "transparent",
        }
    },
    "& .MuiInputLabel-root": {
        color: "#fff",
        fontWeight: 700,
        fontSize: "0.875rem",
        textShadow: "0 1px 2px rgba(0,0,0,0.4)",
        transition: "all 0.3s ease",
    },
    "& .MuiAutocomplete-popupIndicator, & .MuiAutocomplete-clearIndicator": {
        color: "#fff",
        transition: "all 0.3s ease",
        "&:hover": { color: "#00e5ff" },
    },
    "& .MuiAutocomplete-listbox": {
        background: "rgba(255,255,255,0.12)",
        backdropFilter: "blur(16px) saturate(180%)",
        color: "#fff",
        borderRadius: 4,
        fontSize: "0.85rem",
        boxShadow: "0 4px 16px rgba(0,0,0,0.25)",
        "& li.MuiAutocomplete-option": {
            transition: "all 0.2s ease",
            "&:hover": { backgroundColor: "rgba(0,188,212,0.25)" },
            "&.Mui-focused": { backgroundColor: "rgba(0,188,212,0.3)" },
            "&.Mui-selected": { backgroundColor: "rgba(0,188,212,0.35)" },
        }
    }
};
