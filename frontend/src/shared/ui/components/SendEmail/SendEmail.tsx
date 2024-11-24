import { useState, useEffect, useRef } from "react";
import styles from "./sendemail.module.scss";
import Close from "../../../../assets/close.svg";
import { MultiSelectDropdown } from "../MultiSelectDropdown";
import { useSportEvents } from "../../../../features/Filter/api/sportName";

export const SendEmail = () => {
  const [isVisible, setIsVisible] = useState(true);
  const blockRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLImageElement>(null);

  const [multiSelectSportType, setMultiSelectSportType] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [emailError, setEmailError] = useState<boolean>(false);
  const [sportTypeError, setSportTypeError] = useState<boolean>(false);

  const {
    data: sportEventData,
    isLoading: isLoadingSports,
    error: errorSports,
    fetchNextPage: fetchNextSportPage,
    hasNextPage: hasNextSportPage,
  } = useSportEvents(1, 10, searchQuery);

  const sportEventOptions = sportEventData
    ? sportEventData.pages.flatMap((page) =>
        page.items.map((item) => item.sport)
      )
    : [];

  const handleClickOutside = (event: MouseEvent) => {
    if (
      blockRef.current &&
      !blockRef.current.contains(event.target as Node) &&
      !closeButtonRef.current?.contains(event.target as Node)
    ) {
      setIsVisible(false);
    }
  };

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

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleSubmit = () => {
    let valid = true;

    if (email.trim() === "") {
      setEmailError(true);
      valid = false;
    } else {
      setEmailError(false);
    }

    if (multiSelectSportType.length === 0) {
      setSportTypeError(true);
      valid = false;
    } else {
      setSportTypeError(false);
    }

    if (valid) {
      console.log("Email sent: ", email);
      console.log("Selected sports: ", multiSelectSportType);
    }
  };

  if (!isVisible) return null;

  return (
    <div className={styles.block} ref={blockRef}>
      <div className={styles.close} ref={closeButtonRef} onClick={handleClose}>
        <img src={Close} alt="Close" />
      </div>
      <h1 className={styles.title}>
        Подпишитесь на рассылку и будьте в курсе всех спортивных событий
      </h1>

      <div className={styles.input_block}>
        <label className={emailError ? styles.errorText : ""}>Введите ваш email</label>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`${emailError ? styles.errorInput : ""} ${styles.emailInput}`}
        />
      </div>

      <MultiSelectDropdown
        label="Вид спорта"
        value={multiSelectSportType}
        setValue={setMultiSelectSportType}
        options={sportEventOptions}
        fetchMoreOptions={fetchNextSportPage}
        hasNextPage={!!hasNextSportPage}
        onSearch={setSearchQuery}
				isEror={sportTypeError}
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
