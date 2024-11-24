import { useState, useEffect, useRef } from "react";
import styles from "./sendemail.module.scss";
import Close from "../../../../assets/close.svg";
import { MultiSelectDropdown } from "../MultiSelectDropdown";
import { useSportEvents } from "../../../../features/Filter/api/sportName";

export const SendEmail = () => {
  const [isVisible, setIsVisible] = useState(true); // State to control visibility
  const blockRef = useRef<HTMLDivElement>(null); // Reference to the block
  const closeButtonRef = useRef<HTMLImageElement>(null); // Reference to the close button

  const [multiSelectSportType, setMultiSelectSportType] = useState<string[]>(
    []
  );
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [email, setEmail] = useState<string>(""); // State for email input
  const [emailError, setEmailError] = useState<boolean>(false); // State for email error

  const {
    data: sportEventData,
    isLoading: isLoadingSports,
    error: errorSports,
    fetchNextPage: fetchNextSportPage,
    hasNextPage: hasNextSportPage,
  } = useSportEvents(1, 10, searchQuery); // Fetch sport event options

  const sportEventOptions = sportEventData
    ? sportEventData.pages.flatMap((page) =>
        page.items.map((item) => item.sport)
      )
    : [];

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
  const handleSubmit = () => {
    if (email.trim() === "") {
      setEmailError(true); // Show error if email is empty
    } else {
      setEmailError(false); // Reset error if email is valid
      // Здесь можно выполнить дальнейшую обработку данных (например, отправка формы)
      console.log("Email sent: ", email);
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
          className={`${emailError ? styles.errorInput : ""} ${styles.emailInput}`} // Add error class if email is empty
        />
        {emailError && (
          <p className={styles.errorText}>Пожалуйста, введите email</p>
        )}
      </div>

      <MultiSelectDropdown
        label="Вид спорта"
        value={multiSelectSportType}
        setValue={setMultiSelectSportType}
        options={sportEventOptions}
        fetchMoreOptions={fetchNextSportPage}
        hasNextPage={!!hasNextSportPage}
        onSearch={setSearchQuery}
      />

      <button className={styles.show} onClick={handleSubmit}>
        Отправить
      </button>

      {isLoadingSports && <p>Загрузка видов спорта...</p>}
      {errorSports && <p>Произошла ошибка при загрузке данных видов спорта.</p>}
    </div>
  );
};

export default SendEmail;
