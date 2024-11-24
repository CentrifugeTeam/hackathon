import { useState, useEffect, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import styles from "./sendemail.module.scss";
import Close from "../../../../assets/close.svg";
import { MultiSelectDropdown } from "../MultiSelectDropdown";
import { useSportEvents } from "../../../../features/Filter/api/sportName";
import { registerEmail, EmailRegistrationData } from "./api/sendEmail";

export const SendEmail = () => {
  const [isVisible, setIsVisible] = useState(true);
  const blockRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLImageElement>(null);

  const [multiSelectSportType, setMultiSelectSportType] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [emailError, setEmailError] = useState<boolean>(false);
  const [sportError, setSportError] = useState<boolean>(false);

  const {
    data: sportEventData,
    isLoading: isLoadingSports,
    error: errorSports,
    fetchNextPage: fetchNextSportPage,
  } = useSportEvents(1, 10, searchQuery);

  const sportEventOptions = sportEventData
    ? sportEventData.pages.flatMap((page) =>
        page.items.map((item) => ({
          id: item.id,
          sport: item.sport,
        }))
      )
    : [];

  const { mutateAsync, isPending: isMutating } = useMutation<
    void,
    Error,
    EmailRegistrationData
  >({
    mutationFn: registerEmail,
    onSuccess: () => {
      setEmail("");
      setMultiSelectSportType([]);
    },
    onError: (error: Error) => {
      console.error("Error during registration:", error);
    },
  });

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

  const handleSubmit = async () => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (email.trim() === "" || !emailRegex.test(email)) {
      setEmailError(true);
    } else {
      setEmailError(false);
    }

    if (multiSelectSportType.length === 0) {
      setSportError(true);
    } else {
      setSportError(false);
    }

    if (email.trim() !== "" && multiSelectSportType.length > 0 && emailRegex.test(email)) {
      const selectedSportEventIds = sportEventOptions
        .filter((sport) => multiSelectSportType.includes(sport.sport))
        .map((sport) => sport.id);

      const data: EmailRegistrationData = {
        email,
        event_types_id: selectedSportEventIds,
      };

      try {
        await mutateAsync(data);
      } catch (error) {
        console.error("Error during registration:", error);
      }
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
        <label className={emailError ? styles.errorText : ""}>{emailError ? "Введите ваш email правильно" : "Введите ваш email"}</label>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`${emailError ? styles.errorInput : ""} ${styles.emailInput}`}
        />
      </div>

      <MultiSelectDropdown
        label="Выберите вид спорта"
        value={multiSelectSportType}
        setValue={setMultiSelectSportType}
        options={sportEventOptions.map((option) => option.sport)}
        fetchMoreOptions={fetchNextSportPage}
        onSearch={setSearchQuery}
        isEror={sportError}
      />

      <button
        className={styles.show}
        onClick={handleSubmit}
        disabled={isMutating}
      >
        {isMutating ? "Отправка..." : "Отправить"}
      </button>

      {isLoadingSports && <p>Загрузка видов спорта...</p>}
      {errorSports && <p>Произошла ошибка при загрузке данных видов спорта.</p>}
    </div>
  );
};

export default SendEmail;
