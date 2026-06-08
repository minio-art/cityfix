// contexts/LanguageContext.tsx
"use client"

import { createContext, useContext, useState, ReactNode, useEffect } from 'react'

export type Locale = 'ru' | 'kz'

type LanguageContextType = {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: {
    commentSection: {
  title: string
  placeholder: string
  sendButton: string
  unknown: string
}
    adminProblemsPage: {
  title: string
  subtitle: string
  exportButton: string
  searchPlaceholder: string
  categoryFilter: string
  statusFilter: string
  priorityFilter: string
  allCategories: string
  allStatuses: string
  allPriorities: string
  selectedCount: string
  changeStatus: string
  clearSelection: string
  tableProblem: string
  tableCategory: string
  tableStatus: string
  tablePriority: string
  tableDistrict: string
  tableVotes: string
  tableDate: string
  tableAction: string
  showing: string
  of: string
  page: string
  loading: string
  statusUpdated: string
  updateError: string
  connectionError: string
  problemsUpdated: string
  csvId: string
  csvTitle: string
  csvCategory: string
  csvStatus: string
  csvPriority: string
  csvDistrict: string
  csvVotes: string
  csvDate: string
  csvFilename: string
  csvExported: string
}
    adminMapPage: {
  loading: string
  filtersButton: string
  complaints: string
  changeStatus: string
  loadError: string
  statusUpdated: string
  updateError: string
  connectionError: string
}
    adminDashboardPage: {
  title: string
  subtitle: string
  totalProblems: string
  activeIssues: string
  resolved: string
  criticalClusters: string
  problemsByCategory: string
  monthlyTrend: string
  recentReports: string
  loading: string
  count: string
  category: string
  problems: string
  resolvedShort: string
  jul: string
  aug: string
  sep: string
  oct: string
  nov: string
  dec: string
}
    loginToVote: string
voteSuccess: string
voteError: string
loginToComment: string
commentAdded: string
commentError: string
selectPhoto: string
photoUploaded: string
photoError: string
user: string
    clusterDetailPage: {
  backToMap: string
  coordinates: string
  created: string
  totalComplaints: string
  resolvedCount: string
  of: string
  allResolved: string
  problemsInCluster: string
  noProblems: string
  noDescription: string
  votes: string
  detailsButton: string
  loading: string
  clusterNotFound: string
  loadError: string
  statusUpdated: string
  statusError: string
}
    locationSearch: {
  placeholder: string
}
    clusterMap: {
  loginToVote: string
  voteFailed: string
  alreadyVoted: string
  voteSuccess: string
  complaints: string
  votes: string
  voted: string
  voting: string
  vote: string
  edit: string
  details: string
}

    profilePage: {
  pleaseLogin: string
  loginLink: string
  joinedLabel: string
  recently: string
  reportsCount: string
  votedCount: string
  myReportsTab: string
  votedTab: string
  noReports: string
  createFirst: string
  noVotes: string
}
    createProblem: {
  title: string
  subtitle: string
  problemDetails: string
  problemDescription: string
  titleLabel: string
  titlePlaceholder: string
  categoryLabel: string
  categoryPlaceholder: string
  descriptionLabel: string
  descriptionPlaceholder: string
  photosLabel: string
  locationLabel: string
  locationDescription: string
  districtLabel: string
  coordinatesLabel: string
  submitButton: string
  submitting: string
  locationRequired: string
  photoRequired: string
  categoryRequired: string
  successMessage: string
  errorMessage: string
  aiDetected: string
  analyzing: string
  aiRecommendation: string
  category: string
  confidence: string
  useCategory: string
}
    mapFilters: {
  title: string
  resetButton: string
  searchPlaceholder: string
  priorityLabel: string
  statusLabel: string
  categoryLabel: string
  districtLabel: string
}
    problemDetailPage: {
  backToMap: string
  votes: string
  beforePhoto: string
  afterPhoto: string
  noPhoto: string
  noAfterPhoto: string
  uploadAfterPhoto: string
  uploadPhotoFirst: string
  savePhoto: string
  uploading: string
  description: string
  noDescription: string
  statusManagement: string
  statusChangedTo: string
  statusChangeError: string
  confirmTitle: string
  confirmMessage: string
  confirm: string
  cancel: string
  processing: string
  comments: string
  commentPlaceholder: string
  send: string
  sending: string
  noComments: string
  loading: string
  problemNotFound: string
}
    mapPage: {
  loading: string
  filtersButton: string
}
    appSidebar: {
  map: string
  reportProblem: string
  myProfile: string
  logout: string
}
    adminSidebar: {
  dashboard: string
  manageMap: string
  problemsTable: string
  adminPanel: string
  logout: string
}
      registerPage: {
      title: string
      description: string
      usernameLabel: string
      usernamePlaceholder: string
      usernameMinLength: string
      emailLabel: string
      emailPlaceholder: string
      invalidEmail: string
      nameLabel: string
      namePlaceholder: string
      phoneLabel: string
      phonePlaceholder: string
      optionalLabel: string
      passwordLabel: string
      passwordPlaceholder: string
      passwordMinLength: string
      confirmPasswordLabel: string
      confirmPasswordPlaceholder: string
      passwordsDoNotMatch: string
      registerButton: string
      registeringButton: string
      haveAccountText: string
      loginLink: string
      successMessage: string
      errorMessage: string
    }
    loginPage: {
      title: string
      description: string
      usernameLabel: string
      usernamePlaceholder: string
      passwordLabel: string
      passwordPlaceholder: string
      loginButton: string
      loggingInButton: string
      noAccountText: string
      registerLink: string
      welcomeMessage: string
      errorMessage: string
    }
    footer: {
      description: string
      platformTitle: string
      howItWorks: string
      advantages: string
      register: string
      legalTitle: string
      privacyPolicy: string
      termsOfUse: string
      contacts: string
      copyright: string
    }
    hero: {
      badge: string
      titleFirst: string
      titleSecond: string
      description: string
      startButton: string
      learnMoreButton: string
    }
    publicHeader: {
      howItWorks: string
      advantages: string
      login: string
      start: string
      languageSwitch: string
      themeToggle: string
    }
    header: {
      welcome: string
      title: string
      themeToggle: string
      notifications: string
      noNotifications: string
      languageSwitch: string
    }
    howItWorks: {
      badge: string
      title: string
      steps: Array<{ title: string; description: string }>
    }
    stats: {
      badge: string
      title: string
      reports: string
      resolved: string
      activeResidents: string
      cities: string
    }
    cta: {
      title: string
      description: string
      registerButton: string
      loginButton: string
    }
    advantages: {
      badge: string
      title: string
      advantages: Array<{
        title: string
        description: string
      }>
    }
    common: {
      loading: string
      error: string
      close: string
      save: string
      cancel: string
    }
  }
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export const translations = {
  ru: {
    commentSection: {
  title: "Комментарии",
  placeholder: "Добавить комментарий...",
  sendButton: "Отправить комментарий",
  unknown: "Неизвестно"
},
    adminProblemsPage: {
  title: "Проблемы",
  subtitle: "Управление и просмотр всех зарегистрированных проблем",
  exportButton: "Экспорт CSV",
  searchPlaceholder: "Поиск проблем...",
  categoryFilter: "Категория",
  statusFilter: "Статус",
  priorityFilter: "Приоритет",
  allCategories: "Все категории",
  allStatuses: "Все статусы",
  allPriorities: "Все приоритеты",
  selectedCount: "Выбрано",
  changeStatus: "Изменить статус...",
  clearSelection: "Очистить выбор",
  tableProblem: "Проблема",
  tableCategory: "Категория",
  tableStatus: "Статус",
  tablePriority: "Приоритет",
  tableDistrict: "Район",
  tableVotes: "Голосов",
  tableDate: "Дата",
  tableAction: "Действие",
  showing: "Показано",
  of: "из",
  page: "Страница",
  loading: "Загрузка проблем...",
  statusUpdated: "Статус обновлен",
  updateError: "Ошибка обновления",
  connectionError: "Ошибка соединения",
  problemsUpdated: "проблем обновлено",
  csvId: "ID",
  csvTitle: "Заголовок",
  csvCategory: "Категория",
  csvStatus: "Статус",
  csvPriority: "Приоритет",
  csvDistrict: "Район",
  csvVotes: "Голосов",
  csvDate: "Дата",
  csvFilename: "проблемы",
  csvExported: "CSV экспортирован"
},
    adminMapPage: {
  loading: "Загрузка карты...",
  filtersButton: "Фильтры",
  complaints: "жалоб",
  changeStatus: "Изменить статус",
  loadError: "Ошибка загрузки кластеров",
  statusUpdated: "Статус кластера обновлён",
  updateError: "Ошибка обновления статуса",
  connectionError: "Ошибка соединения с сервером"
},
    adminDashboardPage: {
  title: "Панель управления",
  subtitle: "Обзор проблем города и активности пользователей",
  totalProblems: "Всего проблем",
  activeIssues: "Активные",
  resolved: "Решённые",
  criticalClusters: "Критические кластеры",
  problemsByCategory: "Проблемы по категориям",
  monthlyTrend: "Месячная динамика",
  recentReports: "Последние отчёты",
  loading: "Загрузка статистики...",
  count: "Количество",
  category: "Категория",
  problems: "Проблемы",
  resolvedShort: "Решено",
  jul: "Июл",
  aug: "Авг",
  sep: "Сен",
  oct: "Окт",
  nov: "Ноя",
  dec: "Дек"
},
    oginToVote: "Войдите чтобы голосовать",
voteSuccess: "Голос учтён",
voteError: "Ошибка при голосовании",
loginToComment: "Войдите чтобы комментировать",
commentAdded: "Комментарий добавлен",
commentError: "Ошибка при добавлении комментария",
selectPhoto: "Выберите фото",
photoUploaded: "Фото 'После' загружено",
photoError: "Ошибка при загрузке фото",
user: "Пользователь" ,
    clusterDetailPage: {
  backToMap: "Назад к карте",
  coordinates: "Координаты",
  created: "Создан",
  totalComplaints: "Всего жалоб в кластере",
  resolvedCount: "Решено",
  of: "из",
  allResolved: "Все проблемы в этом кластере решены!",
  problemsInCluster: "Проблемы в этом кластере",
  noProblems: "Нет проблем в этом кластере",
  noDescription: "Нет описания",
  votes: "голосов",
  detailsButton: "Подробнее",
  loading: "Загрузка...",
  clusterNotFound: "Кластер не найден",
  loadError: "Не удалось загрузить данные",
  statusUpdated: "Статус обновлён",
  statusError: "Ошибка"
},
    locationSearch: {
  placeholder: "Введите адрес в Казахстане..."
},
    clusterMap: {
  loginToVote: "Пожалуйста, войдите в систему, чтобы проголосовать",
  voteFailed: "Не удалось проголосовать",
  alreadyVoted: "❌ Вы уже голосовали за эту проблему",
  voteSuccess: "✅ Ваш голос учтён!",
  complaints: "жалоб",
  votes: "голосов",
  voted: "✓ Проголосовано",
  voting: "⏳ Голосование...",
  vote: "👍 Голосовать",
  edit: "✏️ Редактировать",
  details: "📋 Подробнее"
},
    profilePage: {
  pleaseLogin: "Пожалуйста, войдите чтобы просмотреть профиль",
  loginLink: "Войти",
  joinedLabel: "Присоединился",
  recently: "Недавно",
  reportsCount: "сообщений",
  votedCount: "Проголосовано",
  myReportsTab: "Мои сообщения",
  votedTab: "Отмеченные",
  noReports: "Вы еще не сообщили ни о каких проблемах.",
  createFirst: "Создать первое сообщение",
  noVotes: "Вы еще не голосовали ни за одну проблему."
},
    createProblem: {
  title: "Сообщить о проблеме",
  subtitle: "Помогите улучшить ваш город, сообщая о замеченных проблемах",
  problemDetails: "Детали проблемы",
  problemDescription: "Опишите проблему, которую хотите сообщить",
  titleLabel: "Название",
  titlePlaceholder: "Например: Большая яма на улице Абая",
  categoryLabel: "Категория",
  categoryPlaceholder: "Выберите категорию",
  descriptionLabel: "Описание",
  descriptionPlaceholder: "Предоставьте детали проблемы...",
  photosLabel: "Фотографии (обязательно)",
  locationLabel: "Местоположение",
  locationDescription: "Найдите адрес на карте или кликните для установки метки",
  districtLabel: "Район",
  coordinatesLabel: "Координаты",
  submitButton: "Отправить",
  submitting: "Отправка...",
  locationRequired: "Пожалуйста, укажите местоположение на карте",
  photoRequired: "Пожалуйста, загрузите хотя бы одно фото",
  categoryRequired: "Пожалуйста, выберите категорию",
  successMessage: "Проблема успешно отправлена!",
  errorMessage: "Произошла ошибка",
  aiDetected: "AI определил категорию",
  analyzing: "AI анализирует фото...",
  aiRecommendation: "AI рекомендация:",
  category: "Категория",
  confidence: "Уверенность",
  useCategory: "Использовать эту категорию"
},
    mapFilters: {
  title: "Фильтры",
  resetButton: "Сбросить",
  searchPlaceholder: "Поиск по кластерам...",
  priorityLabel: "Приоритет",
  statusLabel: "Статус",
  categoryLabel: "Категория",
  districtLabel: "Район"
}
,
    problemDetailPage: {
  backToMap: "Назад к карте",
  votes: "голосов",
  beforePhoto: "Фото до ремонта",
  afterPhoto: "Фото после ремонта",
  noPhoto: "Нет фото",
  noAfterPhoto: "Фото после ремонта пока нет",
  uploadAfterPhoto: "Загрузить фото после ремонта",
  uploadPhotoFirst: "Сначала загрузите фото 'После'",
  savePhoto: "Сохранить фото",
  uploading: "Загрузка...",
  description: "Описание проблемы",
  noDescription: "Нет описания",
  statusManagement: "Управление статусом",
  statusChangedTo: "Статус изменён на",
  statusChangeError: "Ошибка при изменении статуса",
  confirmTitle: "Подтверждение",
  confirmMessage: "Вы уверены, что хотите изменить статус",
  confirm: "Да, подтверждаю",
  cancel: "Отмена",
  processing: "Обработка...",
  comments: "Комментарии",
  commentPlaceholder: "Напишите комментарий...",
  send: "Отправить",
  sending: "Отправка...",
  noComments: "Пока нет комментариев. Будьте первым!",
  loading: "Загрузка...",
  problemNotFound: "Проблема не найдена"
},
    mapPage: {
  loading: "Загрузка карты...",
  filtersButton: "Фильтры"
},
    appSidebar: {
  map: "Карта",
  reportProblem: "Сообщить о проблеме",
  myProfile: "Мой профиль",
  logout: "Выйти"
},
    adminSidebar: {
  dashboard: "Панель управления",
  manageMap: "Управление картой",
  problemsTable: "Таблица проблем",
  adminPanel: "Панель администратора",
  logout: "Выйти"
},
     registerPage: {
      title: "Регистрация",
      description: "Создайте аккаунт, чтобы сообщать о проблемах города",
      usernameLabel: "Имя пользователя",
      usernamePlaceholder: "alex",
      usernameMinLength: "Имя пользователя должно содержать минимум 3 символа",
      emailLabel: "Email",
      emailPlaceholder: "alex@example.com",
      invalidEmail: "Введите корректный email",
      nameLabel: "Имя",
      namePlaceholder: "Алексей",
      phoneLabel: "Телефон",
      phonePlaceholder: "+7 (777) 123-45-67",
      optionalLabel: "(опционально)",
      passwordLabel: "Пароль",
      passwordPlaceholder: "••••••••",
      passwordMinLength: "Пароль должен содержать минимум 6 символов",
      confirmPasswordLabel: "Подтвердите пароль",
      confirmPasswordPlaceholder: "••••••••",
      passwordsDoNotMatch: "Пароли не совпадают",
      registerButton: "Зарегистрироваться",
      registeringButton: "Регистрация...",
      haveAccountText: "Уже есть аккаунт?",
      loginLink: "Войти",
      successMessage: "Регистрация успешна!",
      errorMessage: "Ошибка регистрации"
    },
    loginPage: {
      title: "Вход в CityFix",
      description: "Войдите в свой аккаунт, чтобы продолжить",
      usernameLabel: "Имя пользователя",
      usernamePlaceholder: "alex",
      passwordLabel: "Пароль",
      passwordPlaceholder: "••••••••",
      loginButton: "Войти",
      loggingInButton: "Вход...",
      noAccountText: "Нет аккаунта?",
      registerLink: "Зарегистрироваться",
      welcomeMessage: "Добро пожаловать!",
      errorMessage: "Ошибка входа"
    },
    footer: {
      description: "CityFix помогает жителям сообщать о проблемах, расставлять приоритеты и отслеживать их решение. Вместе мы делаем наши города лучше.",
      platformTitle: "Платформа",
      howItWorks: "Как это работает",
      advantages: "Преимущества",
      register: "Регистрация",
      legalTitle: "Правовая информация",
      privacyPolicy: "Политика конфиденциальности",
      termsOfUse: "Условия использования",
      contacts: "Контакты",
      copyright: "© 2025 CityFix. Создано для улучшения городов."
    },
    hero: {
      badge: "Умная система сообщений о проблемах города",
      titleFirst: "Сообщай. Приоритизируй.",
      titleSecond: "Улучшай свой город.",
      description: "CityFix автоматически объединяет похожие жалобы, показывает приоритеты на интерактивной карте и помогает быстрее решать городские проблемы.",
      startButton: "Начать",
      learnMoreButton: "Узнать больше"
    },
    publicHeader: {
      howItWorks: "Как это работает",
      advantages: "Преимущества",
      login: "Войти",
      start: "Начать",
      languageSwitch: "Сменить язык",
      themeToggle: "Сменить тему"
    },
    header: {
      welcome: "Добро пожаловать",
      title: "CityFix",
      themeToggle: "Сменить тему",
      notifications: "Уведомления",
      noNotifications: "Нет уведомлений",
      languageSwitch: "Сменить язык"
    },
    howItWorks: {
      badge: "Как это работает",
      title: "Три простых шага к лучшему городу",
      steps: [
        {
          title: "Сообщите о проблеме",
          description: "Отметьте проблему на карте, выберите категорию, добавьте описание и фото. Это займет меньше минуты."
        },
        {
          title: "Голосование сообщества",
          description: "Жители видят вашу заявку и голосуют за неё. Похожие проблемы автоматически объединяются в кластеры."
        },
        {
          title: "Город решает проблему",
          description: "Городские службы расставляют приоритеты по количеству голосов и срочности. Отслеживайте статус в реальном времени."
        }
      ]
    },
    stats: {
      badge: "Наши результаты",
      title: "Реальные изменения в цифрах",
      reports: "Сообщений о проблемах",
      resolved: "Решённых проблем",
      activeResidents: "Активных жителей",
      cities: "Городов"
    },
    cta: {
      title: "Готовы сделать свой город лучше?",
      description: "Присоединяйтесь к тысячам активных жителей, которые уже меняют город. Сообщите о проблеме всего за минуту.",
      registerButton: "Создать аккаунт",
      loginButton: "Войти"
    },
    advantages: {
      badge: "Преимущества",
      title: "Почему CityFix работает",
      advantages: [
        {
          title: "Умная кластеризация",
          description: "Похожие проблемы в радиусе 2 км автоматически объединяются в кластеры для более эффективного решения."
        },
        {
          title: "Система приоритетов",
          description: "Цветные маркеры (красный, жёлтый, зелёный) показывают срочность. Чем больше жалоб — тем больше маркер."
        },
        {
          title: "Решения на основе данных",
          description: "Панель администратора с аналитикой в реальном времени помогает эффективно распределять ресурсы."
        },
        {
          title: "Полная прозрачность",
          description: "Отслеживайте все изменения статуса — от создания заявки до её решения. Видно всё, что происходит."
        },
        {
          title: "Интерактивная карта",
          description: "Приближайте карту для просмотра отдельных проблем или отдаляйте для анализа по всему городу. Фильтруйте по категориям и районам."
        },
        {
          title: "Сила сообщества",
          description: "Голосуйте за важные проблемы. Чем больше голосов — тем выше приоритет у кластера."
        }
      ]
    },
    common: {
      loading: "Загрузка...",
      error: "Произошла ошибка",
      close: "Закрыть",
      save: "Сохранить",
      cancel: "Отмена"
    }
  },
  kz: {
    commentSection: {
  title: "Пікірлер",
  placeholder: "Пікір қосу...",
  sendButton: "Пікір жіберу",
  unknown: "Белгісіз"
},
    adminProblemsPage: {
  title: "Мәселелер",
  subtitle: "Барлық тіркелген мәселелерді басқару және көру",
  exportButton: "CSV экспорттау",
  searchPlaceholder: "Мәселелерді іздеу...",
  categoryFilter: "Санат",
  statusFilter: "Мәртебе",
  priorityFilter: "Басымдық",
  allCategories: "Барлық санаттар",
  allStatuses: "Барлық мәртебелер",
  allPriorities: "Барлық басымдықтар",
  selectedCount: "Таңдалды",
  changeStatus: "Мәртебені өзгерту...",
  clearSelection: "Таңдауды өшіру",
  tableProblem: "Мәселе",
  tableCategory: "Санат",
  tableStatus: "Мәртебе",
  tablePriority: "Басымдық",
  tableDistrict: "Аудан",
  tableVotes: "Дауыс",
  tableDate: "Күні",
  tableAction: "Әрекет",
  showing: "Көрсетілген",
  of: "ден",
  page: "Бет",
  loading: "Мәселелер жүктелуде...",
  statusUpdated: "Мәртебе жаңартылды",
  updateError: "Жаңарту қатесі",
  connectionError: "Байланыс қатесі",
  problemsUpdated: "мәселе жаңартылды",
  csvId: "ID",
  csvTitle: "Тақырып",
  csvCategory: "Санат",
  csvStatus: "Мәртебе",
  csvPriority: "Басымдық",
  csvDistrict: "Аудан",
  csvVotes: "Дауыс",
  csvDate: "Күні",
  csvFilename: "мәселелер",
  csvExported: "CSV экспортталды"
},
    adminMapPage: {
  loading: "Карта жүктелуде...",
  filtersButton: "Сүзгілер",
  complaints: "шағым",
  changeStatus: "Мәртебені өзгерту",
  loadError: "Кластерлерді жүктеу қатесі",
  statusUpdated: "Кластер мәртебесі жаңартылды",
  updateError: "Мәртебені жаңарту қатесі",
  connectionError: "Сервермен байланыс қатесі"
},
    adminDashboardPage: {
  title: "Басқару панелі",
  subtitle: "Қала мәселелері мен пайдаланушылар белсенділігіне шолу",
  totalProblems: "Барлық мәселелер",
  activeIssues: "Белсенді",
  resolved: "Шешілген",
  criticalClusters: "Критикалық кластерлер",
  problemsByCategory: "Санаттар бойынша мәселелер",
  monthlyTrend: "Айлық динамика",
  recentReports: "Соңғы есептер",
  loading: "Статистика жүктелуде...",
  count: "Саны",
  category: "Санат",
  problems: "Мәселелер",
  resolvedShort: "Шешілді",
  jul: "Шіл",
  aug: "Там",
  sep: "Қыр",
  oct: "Қаз",
  nov: "Қар",
  dec: "Жел"
},
    loginToVote: "Дауыс беру үшін кіріңіз",
voteSuccess: "Дауыс есепке алынды",
voteError: "Дауыс беру кезінде қате",
loginToComment: "Пікір қалдыру үшін кіріңіз",
commentAdded: "Пікір қосылды",
commentError: "Пікір қосу кезінде қате",
selectPhoto: "Фотоны таңдаңыз",
photoUploaded: "'Кейінгі' фото жүктелді",
photoError: "Фото жүктеу кезінде қате",
user: "Қолданушы",
    clusterDetailPage: {
  backToMap: "Картаға оралу",
  coordinates: "Координаттар",
  created: "Құрылды",
  totalComplaints: "Кластердегі барлық шағымдар",
  resolvedCount: "Шешілді",
  of: "ден",
  allResolved: "Бұл кластердегі барлық мәселелер шешілді!",
  problemsInCluster: "Осы кластердегі мәселелер",
  noProblems: "Бұл кластерде мәселелер жоқ",
  noDescription: "Сипаттама жоқ",
  votes: "дауыс",
  detailsButton: "Толығырақ",
  loading: "Жүктелуде...",
  clusterNotFound: "Кластер табылмады",
  loadError: "Деректерді жүктеу мүмкін болмады",
  statusUpdated: "Мәртебе жаңартылды",
  statusError: "Қате"
},
    locationSearch: {
  placeholder: "Қазақстандағы мекенжайды енгізіңіз..."
},
    clusterMap: {
  loginToVote: "Дауыс беру үшін жүйеге кіріңіз",
  voteFailed: "Дауыс беру мүмкін болмады",
  alreadyVoted: "❌ Сіз бұл мәселеге дауыс бергенсіз",
  voteSuccess: "✅ Дауысыңыз есепке алынды!",
  complaints: "шағым",
  votes: "дауыс",
  voted: "✓ Дауыс берілді",
  voting: "⏳ Дауыс беру...",
  vote: "👍 Дауыс беру",
  edit: "✏️ Өңдеу",
  details: "📋 Толығырақ"
},
    profilePage: {
  pleaseLogin: "Профильді көру үшін кіріңіз",
  loginLink: "Кіру",
  joinedLabel: "Қосылды",
  recently: "Жақында",
  reportsCount: "хабарлама",
  votedCount: "Дауыс берді",
  myReportsTab: "Менің хабарламаларым",
  votedTab: "Белгіленгендер",
  noReports: "Сіз әлі ешқандай мәселе туралы хабарламағансыз.",
  createFirst: "Бірінші хабарламаны жасау",
  noVotes: "Сіз әлі бірде-бір мәселеге дауыс бермегенсіз."
},
    createProblem: {
  title: "Мәселені хабарлау",
  subtitle: "Қалаңызды жақсартуға көмектесіңіз, байқаған мәселелер туралы хабарлаңыз",
  problemDetails: "Мәселе туралы мәліметтер",
  problemDescription: "Хабарлағыңыз келетін мәселені сипаттаңыз",
  titleLabel: "Атауы",
  titlePlaceholder: "Мысалы: Абай көшесіндегі үлкен шұңқыр",
  categoryLabel: "Санат",
  categoryPlaceholder: "Санатты таңдаңыз",
  descriptionLabel: "Сипаттама",
  descriptionPlaceholder: "Мәселенің егжей-тегжейлерін көрсетіңіз...",
  photosLabel: "Фотосуреттер (міндетті)",
  locationLabel: "Орналасуы",
  locationDescription: "Картадан мекенжайды табыңыз немесе белгі қою үшін басыңыз",
  districtLabel: "Аудан",
  coordinatesLabel: "Координаттар",
  submitButton: "Жіберу",
  submitting: "Жіберілуде...",
  locationRequired: "Картада орналасқан жерді көрсетіңіз",
  photoRequired: "Кемінде бір фото жүктеңіз",
  categoryRequired: "Санатты таңдаңыз",
  successMessage: "Мәселе сәтті жіберілді!",
  errorMessage: "Қате орын алды",
  aiDetected: "AI санатты анықтады",
  analyzing: "AI фотоны талдайды...",
  aiRecommendation: "AI ұсынысы:",
  category: "Санат",
  confidence: "Сенімділік",
  useCategory: "Осы санатты пайдалану"
},
    mapFilters: {
  title: "Сүзгілер",
  resetButton: "Қалпына келтіру",
  searchPlaceholder: "Кластерлер бойынша іздеу...",
  priorityLabel: "Басымдық",
  statusLabel: "Мәртебе",
  categoryLabel: "Санат",
  districtLabel: "Аудан"
},
    problemDetailPage: {
  backToMap: "Картаға оралу",
  votes: "дауыс",
  beforePhoto: "Жөндеуге дейінгі фото",
  afterPhoto: "Жөндеуден кейінгі фото",
  noPhoto: "Фото жоқ",
  noAfterPhoto: "Жөндеуден кейінгі фото әлі жоқ",
  uploadAfterPhoto: "Жөндеуден кейінгі фотоны жүктеу",
  uploadPhotoFirst: "Алдымен 'Кейінгі' фотоны жүктеңіз",
  savePhoto: "Фотоны сақтау",
  uploading: "Жүктелуде...",
  description: "Мәселенің сипаттамасы",
  noDescription: "Сипаттама жоқ",
  statusManagement: "Мәртебені басқару",
  statusChangedTo: "Мәртебе өзгертілді",
  statusChangeError: "Мәртебені өзгерту кезінде қате",
  confirmTitle: "Растау",
  confirmMessage: "Мәртебені өзгертуге сенімдісіз бе",
  confirm: "Иә, растаймын",
  cancel: "Болдырмау",
  processing: "Өңделуде...",
  comments: "Пікірлер",
  commentPlaceholder: "Пікір жазыңыз...",
  send: "Жіберу",
  sending: "Жіберілуде...",
  noComments: "Әлі пікірлер жоқ. Бірінші болыңыз!",
  loading: "Жүктелуде...",
  problemNotFound: "Мәселе табылмады"
},
    mapPage: {
  loading: "Карта жүктелуде...",
  filtersButton: "Сүзгілер"
},
    appSidebar: {
  map: "Карта",
  reportProblem: "Мәселені хабарлау",
  myProfile: "Менің профилім",
  logout: "Шығу"
},
    
    adminSidebar: {
  dashboard: "Басқару панелі",
  manageMap: "Картаны басқару",
  problemsTable: "Мәселелер кестесі",
  adminPanel: "Әкімші панелі",
  logout: "Шығу"
},
     registerPage: {
      title: "Тіркелу",
      description: "Қала мәселелері туралы хабарлау үшін аккаунт жасаңыз",
      usernameLabel: "Пайдаланушы аты",
      usernamePlaceholder: "alex",
      usernameMinLength: "Пайдаланушы аты кемінде 3 таңбадан тұруы керек",
      emailLabel: "Email",
      emailPlaceholder: "alex@example.com",
      invalidEmail: "Дұрыс email енгізіңіз",
      nameLabel: "Аты",
      namePlaceholder: "Алексей",
      phoneLabel: "Телефон",
      phonePlaceholder: "+7 (777) 123-45-67",
      optionalLabel: "(міндетті емес)",
      passwordLabel: "Құпия сөз",
      passwordPlaceholder: "••••••••",
      passwordMinLength: "Құпия сөз кемінде 6 таңбадан тұруы керек",
      confirmPasswordLabel: "Құпия сөзді растаңыз",
      confirmPasswordPlaceholder: "••••••••",
      passwordsDoNotMatch: "Құпия сөздер сәйкес келмейді",
      registerButton: "Тіркелу",
      registeringButton: "Тіркелу...",
      haveAccountText: "Аккаунтыңыз бар ма?",
      loginLink: "Кіру",
      successMessage: "Тіркелу сәтті өтті!",
      errorMessage: "Тіркелу қатесі"
    },
    loginPage: {
      title: "CityFix кіру",
      description: "Жалғастыру үшін аккаунтыңызға кіріңіз",
      usernameLabel: "Пайдаланушы аты",
      usernamePlaceholder: "alex",
      passwordLabel: "Құпия сөз",
      passwordPlaceholder: "••••••••",
      loginButton: "Кіру",
      loggingInButton: "Кіру...",
      noAccountText: "Аккаунтыңыз жоқ па?",
      registerLink: "Тіркелу",
      welcomeMessage: "Қош келдіңіз!",
      errorMessage: "Кіру қатесі"
    },
    footer: {
      description: "CityFix тұрғындарға мәселелер туралы хабарлауға, басымдықтарды белгілеуге және олардың шешімін бақылауға көмектеседі. Бірге біз қалаларымызды жақсартамыз.",
      platformTitle: "Платформа",
      howItWorks: "Қалай жұмыс істейді",
      advantages: "Артықшылықтар",
      register: "Тіркелу",
      legalTitle: "Құқықтық ақпарат",
      privacyPolicy: "Құпиялылық саясаты",
      termsOfUse: "Пайдалану шарттары",
      contacts: "Байланыс",
      copyright: "© 2025 CityFix. Қалаларды жақсарту үшін жасалған."
    },
    hero: {
      badge: "Қала мәселелері туралы ақылды хабарлау жүйесі",
      titleFirst: "Мәселеңді хабарла",
      titleSecond: "Өз қалаңды жақсарт.",
      description: "CityFix ұқсас шағымдарды автоматты түрде біріктіреді, интерактивті картада басымдықтарды көрсетеді және қалалық мәселелерді тезірек шешуге көмектеседі.",
      startButton: "Бастау",
      learnMoreButton: "Көбірек білу"
    },
    publicHeader: {
      howItWorks: "Қалай жұмыс істейді",
      advantages: "Артықшылықтар",
      login: "Кіру",
      start: "Бастау",
      languageSwitch: "Тілді өзгерту",
      themeToggle: "Тақырыпты өзгерту"
    },
    header: {
      welcome: "Қош келдіңіз",
      title: "CityFix",
      themeToggle: "Тақырыпты өзгерту",
      notifications: "Хабарландырулар",
      noNotifications: "Хабарландырулар жоқ",
      languageSwitch: "Тілді өзгерту"
    },
    howItWorks: {
      badge: "Қалай жұмыс істейді",
      title: "Жақсы қалаға үш қарапайым қадам",
      steps: [
        {
          title: "Мәселені хабарлаңыз",
          description: "Картадағы мәселені белгілеңіз, санатты таңдаңыз, сипаттама мен фотосурет қосыңыз. Бір минуттан аз уақыт алады."
        },
        {
          title: "Қауымдастық дауыс беруі",
          description: "Тұрғындар сіздің өтініміңізді көріп, оған дауыс береді. Ұқсас мәселелер автоматты түрде кластерлерге біріктіріледі."
        },
        {
          title: "Қала мәселені шешеді",
          description: "Қалалық қызметтер дауыс саны мен жеделдік бойынша басымдықтарды белгілейді. Мәртебені нақты уақытта бақылаңыз."
        }
      ]
    },
    stats: {
      badge: "Біздің нәтижелер",
      title: "Сандардағы нақты өзгерістер",
      reports: "Мәселелер туралы хабарламалар",
      resolved: "Шешілген мәселелер",
      activeResidents: "Белсенді тұрғындар",
      cities: "Қалалар"
    },
    cta: {
      title: "Өз қалаңызды жақсартуға дайынсыз ба?",
      description: "Қаланы өзгертетін мыңдаған белсенді тұрғындарға қосылыңыз. Бір минут ішінде мәселе туралы хабарлаңыз.",
      registerButton: "Тіркелу",
      loginButton: "Кіру"
    },
    advantages: {
      badge: "Артықшылықтар",
      title: "CityFix неге жұмыс істейді",
      advantages: [
        {
          title: "Ақылды кластерлеу",
          description: "2 км радиустағы ұқсас мәселелер тиімдірек шешу үшін автоматты түрде кластерлерге біріктіріледі."
        },
        {
          title: "Басымдықтар жүйесі",
          description: "Түсті маркерлер (қызыл, сары, жасыл) жеделдікті көрсетеді. Шағымдар көп болған сайын — маркер үлкенірек болады."
        },
        {
          title: "Деректерге негізделген шешімдер",
          description: "Нақты уақыттағы аналитикасы бар әкімші панелі ресурстарды тиімді бөлуге көмектеседі."
        },
        {
          title: "Толық ашықтық",
          description: "Өтінімді құрудан бастап оның шешіміне дейінгі барлық мәртебе өзгерістерін қадағалаңыз. Болып жатқанның бәрі көрінеді."
        },
        {
          title: "Интерактивті карта",
          description: "Жеке мәселелерді көру үшін картаны жақындатыңыз немесе бүкіл қала бойынша талдау үшін алыстатыңыз. Санаттар мен аудандар бойынша сүзіңіз."
        },
        {
          title: "Қауымдастық күші",
          description: "Маңызды мәселелерге дауыс беріңіз. Дауыс көп болған сайын — кластердің басымдылығы соғұрлым жоғары болады."
        }
      ]
    },
    common: {
      loading: "Жүктелуде...",
      error: "Қате орын алды",
      close: "Жабу",
      save: "Сақтау",
      cancel: "Болдырмау"
    }
  }
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>('ru')
  const [mounted, setMounted] = useState(false)

  // Загрузка сохраненного языка из localStorage
  useEffect(() => {
    const savedLocale = localStorage.getItem('app-locale') as Locale
    if (savedLocale && (savedLocale === 'ru' || savedLocale === 'kz')) {
      setLocale(savedLocale)
    }
    setMounted(true)
  }, [])

  // Сохранение языка в localStorage
  const handleSetLocale = (newLocale: Locale) => {
    setLocale(newLocale)
    localStorage.setItem('app-locale', newLocale)
  }

  // Предотвращаем гидратацию
  if (!mounted) {
    return null
  }

  return (
    <LanguageContext.Provider value={{
      locale,
      setLocale: handleSetLocale,
      t: translations[locale]
    }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return context
}