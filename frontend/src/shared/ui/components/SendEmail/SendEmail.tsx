import { useState, useEffect, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import styles from "./sendemail.module.scss";
import Close from "../../../../assets/close.svg";
import { MultiSelectDropdown } from "../MultiSelectDropdown";
import { useSportEvents } from "../../../../features/Filter/api/sportName";
import { registerEmail, EmailRegistrationData } from "./api/sendEmail";

// Assuming sportEventOptions is an array of objects with id and sport
export const SendEmail = () => {
  const [isVisible, setIsVisible] = useState(true); // State to control visibility
  const blockRef = useRef<HTMLDivElement>(null); // Reference to the block
  const closeButtonRef = useRef<HTMLImageElement>(null); // Reference to the close button

  const [multiSelectSportType, setMultiSelectSportType] = useState<string[]>(
    []
  ); // Selected sport types
  const [searchQuery, setSearchQuery] = useState<string>(""); // Search query for sports
  const [email, setEmail] = useState<string>(""); // State for email input
  const [emailError, setEmailError] = useState<boolean>(false); // Email error state

  const {
    data: sportEventData,
    isLoading: isLoadingSports,
    error: errorSports,
    fetchNextPage: fetchNextSportPage,
  } = useSportEvents(1, 10, searchQuery); // Fetch sport event options

  // Assuming sportEventOptions is an array of objects { id: number, sport: string }
  const sportEventOptions = sportEventData
    ? sportEventData.pages.flatMap((page) =>
        page.items.map((item) => ({
          id: item.id, // Include id
          sport: item.sport,
        }))
      )
    : [];

  // Fixing the mutation typing to match the expected data structure
  const { mutateAsync, isPending: isMutating } = useMutation<
    void,
    Error,
    EmailRegistrationData
  >({
    mutationFn: registerEmail,
    onSuccess: () => {
      // Handle success (e.g., show a success message, reset form, etc.)
      console.log("Registration successful!");
      setEmail(""); // Clear email input on success
      setMultiSelectSportType([]); // Clear selected sports
    },
    onError: (error: Error) => {
      // Handle error (e.g., show an error message)
      console.error("Error during registration:", error);
    },
  });

  // Handle closing the block when clicking outside
  const handleClickOutside = (event: MouseEvent) => {
    if (
      blockRef.current &&
      !blockRef.current.contains(event.target as Node) && // Check if click is outside the block
      !closeButtonRef.current?.contains(event.target as Node) // Also check if click is not on the close button
    ) {
      setIsVisible(false); // Close the component
    }
  };

  // Add event listener when component mounts, remove it on unmount
  useEffect(() => {
    if (isVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isVisible]);

  // Close the component when close button is clicked
  const handleClose = () => {
    setIsVisible(false); // Close the component
  };

  // Handle email validation and submit
  const handleSubmit = async () => {
    if (email.trim() === "") {
      setEmailError(true); // Show error if email is empty
    } else {
      setEmailError(false); // Reset error if email is valid
      const selectedSportEventIds = sportEventOptions
        .filter((sport) => multiSelectSportType.includes(sport.sport)) // Use `sport` as the filter key
        .map((sport) => sport.id); // Get the selected sport event IDs

      const data: EmailRegistrationData = {
        email,
        event_types_id: selectedSportEventIds,
      };

      try {
        await mutateAsync(data); // Call the mutation to register the email with sport events
      } catch (error) {
        console.error("Error during registration:", error);
      }
    }
  };

  if (!isVisible) return null; // If the block is not visible, return null to unmount it

  return (
    <div className={styles.block} ref={blockRef}>
      <div className={styles.close} ref={closeButtonRef} onClick={handleClose}>
        <img src={Close} alt="Close" />
      </div>
      <h1 className={styles.title}>
        Подпишитесь на рассылку и будьте в курсе всех спортивных событий
      </h1>

      <div className={styles.input_block}>
        <label>Введите ваш email</label>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)} // Update email state
          className={`${emailError ? styles.errorInput : ""} ${
            styles.emailInput
          }`} // Add error class if email is empty
        />
        {emailError && (
          <p className={styles.errorText}>Пожалуйста, введите email</p>
        )}
      </div>

      <MultiSelectDropdown
        label="Вид спорта"
        value={multiSelectSportType}
        setValue={setMultiSelectSportType}
        options={sportEventOptions.map((option) => option.sport)} // Only pass sport names here
        fetchMoreOptions={fetchNextSportPage}
        onSearch={setSearchQuery}
      />

      <button
        className={styles.show}
        onClick={handleSubmit}
        disabled={isMutating} // Use `isMutating` instead of `isSubmitting`
      >
        {isMutating ? "Отправка..." : "Отправить"}
      </button>

      {isLoadingSports && <p>Загрузка видов спорта...</p>}
      {errorSports && <p>Произошла ошибка при загрузке данных видов спорта.</p>}
    </div>
  );
};

export default SendEmail;
