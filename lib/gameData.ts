// Board squares in clockwise order with correct sequence
export const BOARD_SQUARES = [
  'Start',              // +200 energy every pass
  'Bounce',             // +100
  'Rock',              // +100
  'Skate',             // +100
  'Roll',              // +100
  'Basics',            // +100
  'Freeze',            // +0
  'Wave',              // +100
  'Chance Card',       // Draw chance card
  'Cypher Gate',       // +100, Enter Cypher (Gate 1)
  'Concept / Story',   // +200
  'Footwork',          // +100
  'Freestyle',         // +200
  'Isolation',         // +100
  'Dynamics',          // +100
  'Cypher Gate 2',    // Enter Cypher (Gate 2)
  'Trap Card',         // Draw trap card
  'Levels',            // +100
  'Space',             // +200
  'Chance Card',       // Draw chance card
  'Head / Arms',       // +200
  'Cypher Gate 3',     // Enter Cypher (Gate 3)
  'Trap Card',         // Draw trap card
  'Chest / Hips',      // +0 (end of loop)
] as const;

export type SquareType = typeof BOARD_SQUARES[number];

// Energy values for each square
export const SQUARE_ENERGY: Record<SquareType, number> = {
  'Start': 200,
  'Bounce': 100,
  'Rock': 100,
  'Skate': 100,
  'Roll': 100,
  'Basics': 100,
  'Freeze': 0,
  'Wave': 100,
  'Chance Card': 0,
  'Cypher Gate': 100,
  'Cypher Gate 2': 0,
  'Cypher Gate 3': 0,
  'Concept / Story': 200,
  'Footwork': 100,
  'Freestyle': 200,
  'Isolation': 100,
  'Dynamics': 100,
  'Trap Card': 0,
  'Levels': 100,
  'Space': 200,
  'Head / Arms': 200,
  'Chest / Hips': 0,
};

// Cypher Gate squares
export const CYPHER_GATES: SquareType[] = [
  'Cypher Gate',
  'Cypher Gate 2',
  'Cypher Gate 3',
];

// Chance Cards
export interface ChanceCard {
  id: number;
  title: string;
  effect: string;
  description: string;
  energyChange?: number;
  canSave?: boolean; // Can this card be saved?
  positionChange?: number | 'start' | 'nearest_cypher' | 'space' | 'freeze' | 'swap'; // Position effect
  diceModifier?: 'double_dice' | { type: 'penalty'; value: number }; // Dice roll modifier
  nextSquareEffect?: {
    squareName: string; // Square name to trigger on
    effect: {
      type: 'energy_penalty' | 'energy_bonus' | 'no_energy' | 'auto_complete' | 'fail_task';
      value?: number; // For energy changes
    };
  };
}

export const CHANCE_CARDS: ChanceCard[] = [
  {
    id: 1,
    title: 'Groove Blessing',
    effect: '+50 Energy',
    description: 'Bugün ritim seninle!',
    energyChange: 50,
    canSave: false,
  },
  {
    id: 2,
    title: 'Extra Bouncy',
    effect: '2x Points on next Bounce',
    description: 'Yerinde duramıyorsun! Bir sonraki bounce karesine geldiğinde 2x puan.',
    canSave: true,
    nextSquareEffect: {
      squareName: 'Bounce',
      effect: {
        type: 'energy_bonus',
        value: 100, // Double the normal 100 energy
      },
    },
  },
  {
    id: 3,
    title: 'Call Out Power',
    effect: 'Battle Challenge',
    description: 'Hey sen! Karşıma geç! Battle Mode- İstediğin oyuncu ile battle yap, kazanırsan rakibinin bir tane taşını al. Training Mode- Enerjisi 500 veya daha fazla olan bir oyuncudan 300 puan çal.',
    canSave: true,
  },
  {
    id: 4,
    title: 'Double Move',
    effect: 'Roll Dice Twice',
    description: 'Ups! Çift zar at',
    canSave: false,
    diceModifier: 'double_dice',
  },
  {
    id: 5,
    title: 'Space Control',
    effect: 'Go to Space + Roll Again',
    description: 'Space karesine giderek görevi yap ve tekrar zar at. +50 Enerji',
    energyChange: 50,
    canSave: false,
    positionChange: 'space',
    diceModifier: 'double_dice',
  },
  {
    id: 6,
    title: 'The Come Back',
    effect: 'Skip Turn or Re-roll +200 Energy',
    description: 'Bu kartı sakla, istediğin bir tur pas geçip dinlen veya tekrar zar at. Kullanınca +200 enerji kazan ve destenin altına geri koy.',
    energyChange: 200,
    canSave: true,
  },
  {
    id: 7,
    title: 'Comfort Zone',
    effect: 'Move Back 4 Squares +50 Energy',
    description: 'Kutunun içinden çıkamadın! 4 kare geri git! +50 enerji',
    energyChange: 50,
    canSave: false,
    positionChange: -4,
  },
  {
    id: 8,
    title: 'Clean the Floor',
    effect: 'Auto-complete Floorwork',
    description: 'Bir sonraki Floorwork karesine gelişinde görevi otomatik tamamlamış kabul edilirsin.',
    canSave: true,
    nextSquareEffect: {
      squareName: 'Footwork',
      effect: {
        type: 'auto_complete',
      },
    },
  },
  {
    id: 9,
    title: 'Freestyle Boost',
    effect: '+100 Energy',
    description: 'Şimdi hemen bir round Freestyle yap ve onlara gücünü göster!',
    energyChange: 100,
    canSave: false,
  },
  {
    id: 10,
    title: 'Loose Control',
    effect: '-50 Energy',
    description: '',
    energyChange: -50,
    canSave: false,
  },
  {
    id: 11,
    title: 'Interview',
    effect: 'No Effect',
    description: 'Kendi dans hikayeni anlattığın bir röportaj verdin. Hayranların heyecanla bekliyor!',
    canSave: false,
  },
  {
    id: 12,
    title: 'Rewind',
    effect: 'Return to Start (No Energy)',
    description: 'Başlangıç karesine geri dön. Puan alma.',
    canSave: false,
    positionChange: 'start',
  },
  {
    id: 13,
    title: 'Flow State',
    effect: '+50 Energy',
    description: 'Tam odaklandın ve akış haline girdin.',
    energyChange: 50,
    canSave: false,
  },
  {
    id: 14,
    title: 'Break Focus',
    effect: 'Disrupt Next Player',
    description: 'Rakibinin dikkati dağıldı. Senden sonraki oyuncu bir round hareket edemez ve -50 enerji kaybeder.',
    canSave: true,
  },
  {
    id: 15,
    title: 'CYPHER PORTAL',
    effect: 'Teleport to Nearest Cypher Gate',
    description: 'En yakın Cypher kapısına ışınlandın.',
    canSave: false,
    positionChange: 'nearest_cypher',
  },
  {
    id: 16,
    title: 'Celebrity Dancer',
    effect: '+50 Energy',
    description: 'Ünlü bir sanatçıyla dans ettin, hayranların arttı!',
    energyChange: 50,
    canSave: false,
  },
  {
    id: 17,
    title: 'Music is the Key',
    effect: '+100 Energy',
    description: 'Müzikaliteni göster (1 Tur) ve 100 Enerji kazan',
    energyChange: 100,
    canSave: false,
  },
  {
    id: 18,
    title: 'The Choreographer',
    effect: 'Repeat Combo 3x +50 Energy',
    description: 'Bir sonraki roundda bir komboyu 3 kere tekrarla. +50 Enerji',
    energyChange: 50,
    canSave: true,
  },
  {
    id: 19,
    title: 'The World Champion',
    effect: 'Steal 100 Energy from Each Player',
    description: 'Herkesten 100\'er enerji topla (örneğin 3 oyuncu varsa toplam 300 enerji çal)',
    canSave: false,
  },
  {
    id: 20,
    title: 'Cramp',
    effect: 'Fail Next Task -100 Energy',
    description: 'Bacaklarına kramp girdi. Sonraki round zar atıp geldiğin görev karesinde başarısız sayılırsın. (Görev karesine denk gelmezse de enerji kaybı olur)',
    energyChange: -100,
    canSave: true,
    nextSquareEffect: {
      squareName: 'Footwork', // Or any task square - this is a general "fail next task" effect
      effect: {
        type: 'fail_task',
      },
    },
  },
  {
    id: 21,
    title: 'Low Concentration',
    effect: '-50 Energy',
    description: 'Bir türlü moda giremedin.',
    energyChange: -50,
    canSave: false,
  },
  {
    id: 22,
    title: 'Beast Mode',
    effect: '+100 Energy',
    description: 'Canavar modunu açtın, kimse seni durduramıyor!',
    energyChange: 100,
    canSave: false,
  },
  {
    id: 23,
    title: 'Get Down',
    effect: '+200 Energy',
    description: '',
    energyChange: 200,
    canSave: false,
  },
  {
    id: 24,
    title: 'Get it Like That',
    effect: '+200 Energy',
    description: '',
    energyChange: 200,
    canSave: false,
  },
];

// Trap Cards
export interface TrapCard {
  id: number;
  title: string;
  effect: string;
  description: string;
  energyChange?: number;
  canSave?: boolean; // Can this card be saved?
  positionChange?: number | 'start' | 'nearest_cypher' | 'space' | 'freeze' | 'swap'; // Position effect
  diceModifier?: 'double_dice' | { type: 'penalty'; value: number }; // Dice roll modifier
  nextSquareEffect?: {
    squareName: string; // Square name to trigger on
    effect: {
      type: 'energy_penalty' | 'energy_bonus' | 'no_energy' | 'auto_complete' | 'fail_task';
      value?: number; // For energy changes
    };
  };
}

export const TRAP_CARDS: TrapCard[] = [
  {
    id: 1,
    title: 'Energy Leak',
    effect: '-50 Energy',
    description: 'Oooops… Nefes nefese kaldın!',
    energyChange: -50,
    canSave: false,
  },
  {
    id: 2,
    title: 'Off Beat',
    effect: 'No Energy on next Musicality',
    description: 'Ritmi yarım vuruş kaçırdın. Bir sonraki Musicality karesine denk gelişinde enerji alamazsın. (Bu kartı sakla ve görev tamamlandıktan sonra destenin altına yerleştir.)',
    canSave: true,
    nextSquareEffect: {
      squareName: 'Wave', // Wave is the musicality square
      effect: {
        type: 'no_energy',
      },
    },
  },
  {
    id: 3,
    title: 'Stiff Mode',
    effect: '-50 Energy',
    description: 'Vücudun kaskatı oldu. Hastaneye gitmelisin!',
    energyChange: -50,
    canSave: false,
  },
  {
    id: 4,
    title: 'Burnout',
    effect: '-100 Energy',
    description: 'Çok hızlı girdin, nefes bitti.',
    energyChange: -100,
    canSave: false,
  },
  {
    id: 5,
    title: 'Misstep',
    effect: 'Move Back 4 Squares',
    description: 'Kareyi yanlış okudun! 4 kare geri git.',
    canSave: false,
    positionChange: -4,
  },
  {
    id: 6,
    title: 'Slippery Floor',
    effect: 'Lose 1 Stone or +500 Energy',
    description: 'Yer kaygan… Floorwork\'e düştün. Taşın varsa -1 taş kaybettin ama +500 enerji kazandın.',
    canSave: false,
  },
  {
    id: 7,
    title: 'Lost in Cypher',
    effect: 'Return All Cards',
    description: 'Cypher kalabalıktı, kayboldun. Elinde sakladığın kartların hepsini desteye geri koy.',
    canSave: false,
  },
  {
    id: 8,
    title: 'Ego Check',
    effect: '-200 Energy',
    description: 'Biraz fazla havaya girdin…',
    energyChange: -200,
    canSave: false,
  },
  {
    id: 9,
    title: 'Power Down',
    effect: 'Skip Turn +50 Energy',
    description: 'Işıklar söndü, müzik kesildi. Bir tur dans etme ve +50 Enerji kazan',
    energyChange: 50,
    canSave: false,
  },
  {
    id: 10,
    title: 'Body Lock',
    effect: '-100 Energy + Swap Position',
    description: 'Her yerini kramplar sardı. -100 Enerji ve bir oyuncuyla yer değiş.',
    energyChange: -100,
    canSave: false,
    positionChange: 'swap',
  },
  {
    id: 11,
    title: 'Fake Confidence',
    effect: 'Give 100 Energy',
    description: 'Özgüven gösterdin ama kimse yemedii… En yüksek enerjiye sahip oyuncuya 100 enerji ver.',
    canSave: false,
  },
  {
    id: 12,
    title: 'Exchange',
    effect: 'Swap Energy',
    description: 'Birbirinize hareketlerinizi öğrettiniz. Sana en yakın oyuncu ile enerji değiş tokuşu yap (swap).',
    canSave: false,
  },
  {
    id: 13,
    title: 'Delay Effect',
    effect: 'Roll Again -2',
    description: 'Battle\'a geciktin… Bir kere daha zar at. Zar atışın -2 sayı ceza ile oynanır (örneğin 3 attıysan, 3-2= 1, 1 sayı hareket edebilirsin. Minimum 1).',
    canSave: false,
    diceModifier: { type: 'penalty', value: 2 },
  },
  {
    id: 14,
    title: 'Uhhh DJ',
    effect: '-100 Energy',
    description: 'DJ yanlış şarkıyı açtı. Koreografiyi karıştırdın.',
    energyChange: -100,
    canSave: false,
  },
  {
    id: 15,
    title: 'CYBER GLITCH',
    effect: 'Return to Start',
    description: 'Sistem hata verdi! Başlangıca geri dön ve enerji alma.',
    canSave: false,
    positionChange: 'start',
  },
  {
    id: 16,
    title: 'Footwork Collapse',
    effect: '-50 Energy on next Footwork',
    description: 'Ayaklar birbirine girdi. Bir sonraki Footwork karesinde -50 enerji cezası alırsın.',
    canSave: true,
    nextSquareEffect: {
      squareName: 'Footwork',
      effect: {
        type: 'energy_penalty',
        value: -50,
      },
    },
  },
  {
    id: 17,
    title: 'Wrong Style',
    effect: '-50 Energy',
    description: 'Tamamen başka bir stil yaptın…',
    energyChange: -50,
    canSave: false,
  },
  {
    id: 18,
    title: 'Social Media Fail',
    effect: '-50 Energy (or -150)',
    description: 'Paylaştığın videoya kötü yorumlar geldi. -50 enerji. Eğer enerjin 500\'den fazlaysa ekstra -100 enerji.',
    energyChange: -50,
    canSave: false,
  },
  {
    id: 19,
    title: 'The Debt',
    effect: 'Pay 300 Energy',
    description: 'Zamanında borç yapmıştın, kapına dayandı! Eğer 300+ enerjin varsa 300 enerji öde. Yoksa bir şey olmaz.',
    canSave: false,
  },
  {
    id: 20,
    title: 'In the Streets',
    effect: 'Auto Battle',
    description: 'Yan sokakta rakip dansçılar seni çevirdi. En yakın rakip seni battle\'a çağırır (otomatik). Kaybedersen -1 taş (yoksa -150 enerji).',
    canSave: false,
  },
  {
    id: 21,
    title: 'Battle Lost',
    effect: '-100 Energy',
    description: 'Battle\'ı kaybettin çünkü jüri hakkını yedi!',
    energyChange: -100,
    canSave: false,
  },
  {
    id: 22,
    title: 'Monkey Business',
    effect: 'Buy Stone for 500 Energy',
    description: 'Taşı olan bir oyuncudan 500 enerji karşılığında bir adet taşını al. Bu kartı saklayıp sonra da kullanabilirsin. Kullandıktan sonra destenin altına geri koyulur.',
    canSave: true,
  },
  {
    id: 23,
    title: 'Frozen',
    effect: 'Go to Freeze -200 Energy',
    description: 'Doğrudan freeze karesine git! -200 enerji kaybederek görevi yap. Başarısız olursan -100 Enerji daha.',
    energyChange: -200,
    canSave: false,
    positionChange: 'freeze',
  },
];

// Get square energy reward
export function getSquareEnergy(square: SquareType): number {
  return SQUARE_ENERGY[square] || 0;
}

// Check if square is a Cypher Gate
export function isCypherGate(square: SquareType): boolean {
  return CYPHER_GATES.includes(square);
}

// Check if square is a card square
export function isCardSquare(square: SquareType): boolean {
  return square === 'Chance Card' || square === 'Trap Card';
}

// Concept Cards (for Cypher Zone)
export interface ConceptCard {
  id: number;
  concept: string;
  category: 'animal' | 'character' | 'artist' | 'celebrity' | 'dancer' | 'object';
  description: string;
}

export const CONCEPT_CARDS: ConceptCard[] = [
  { id: 1, concept: 'Lion', category: 'animal', description: 'Perform with the strength and pride of a lion' },
  { id: 2, concept: 'Snake', category: 'animal', description: 'Move with the fluidity and grace of a snake' },
  { id: 3, concept: 'Eagle', category: 'animal', description: 'Soar with the freedom and power of an eagle' },
  { id: 4, concept: 'Robot', category: 'character', description: 'Move with mechanical precision and stiffness' },
  { id: 5, concept: 'Superhero', category: 'character', description: 'Perform with heroic energy and power' },
  { id: 6, concept: 'Michael Jackson', category: 'artist', description: 'Channel the King of Pop\'s iconic style' },
  { id: 7, concept: 'Beyoncé', category: 'artist', description: 'Bring the queen\'s fierce energy and confidence' },
  { id: 8, concept: 'Chris Brown', category: 'artist', description: 'Showcase smooth moves and rhythm' },
  { id: 9, concept: 'Usher', category: 'artist', description: 'Bring the smooth R&B swagger' },
  { id: 10, concept: 'Bruce Lee', category: 'celebrity', description: 'Combine martial arts precision with dance' },
  { id: 11, concept: 'Muhammad Ali', category: 'celebrity', description: 'Float like a butterfly, sting like a bee' },
  { id: 12, concept: 'Les Twins', category: 'dancer', description: 'Showcase twin synchronization and creativity' },
  { id: 13, concept: 'B-Boy', category: 'dancer', description: 'Bring authentic breaking energy' },
  { id: 14, concept: 'Umbrella', category: 'object', description: 'Incorporate an umbrella into your performance' },
  { id: 15, concept: 'Mirror', category: 'object', description: 'Reflect and mirror movements' },
  { id: 16, concept: 'Rope', category: 'object', description: 'Use rope as a prop in your dance' },
];

// Get random concept card
export function getRandomConceptCard(): ConceptCard {
  return CONCEPT_CARDS[Math.floor(Math.random() * CONCEPT_CARDS.length)];
}

// Flow Cards (for Battle in Cypher Gate and Cypher Zone)
export interface FlowCard {
  id: number;
  title: string;
  description: string;
  concept?: string; // Creative concept for the dance
  story?: string; // Story or narrative element
  category: 'animal' | 'character' | 'artist' | 'celebrity' | 'dancer' | 'object' | 'emotion' | 'movement' | 'style' | 'concept' | 'story';
}

export const FLOW_CARDS: FlowCard[] = [
  // Animals
  { id: 1, title: 'Lion', category: 'animal', description: 'Aslan gibi güçlü ve gururlu dans et' },
  { id: 2, title: 'Snake', category: 'animal', description: 'Yılan gibi akıcı ve zarif hareket et' },
  { id: 3, title: 'Eagle', category: 'animal', description: 'Kartal gibi özgür ve güçlü uç' },
  { id: 4, title: 'Tiger', category: 'animal', description: 'Kaplan gibi vahşi ve enerjik ol' },
  { id: 5, title: 'Dolphin', category: 'animal', description: 'Yunus gibi neşeli ve akıcı hareket et' },
  { id: 6, title: 'Phoenix', category: 'animal', description: 'Anka kuşu gibi yeniden doğuş enerjisiyle dans et' },
  
  // Characters
  { id: 7, title: 'Robot', category: 'character', description: 'Robot gibi mekanik ve kesin hareket et' },
  { id: 8, title: 'Superhero', category: 'character', description: 'Süper kahraman gibi kahramanca enerjiyle performans göster' },
  { id: 9, title: 'Ninja', category: 'character', description: 'Ninja gibi gizli ve hızlı hareket et' },
  { id: 10, title: 'Warrior', category: 'character', description: 'Savaşçı gibi cesur ve kararlı ol' },
  
  // Artists
  { id: 11, title: 'Michael Jackson', category: 'artist', description: 'Pop\'un Kralı\'nın ikonik stilini yansıt' },
  { id: 12, title: 'Beyoncé', category: 'artist', description: 'Kraliçenin güçlü enerjisini ve özgüvenini getir' },
  { id: 13, title: 'Chris Brown', category: 'artist', description: 'Akıcı hareketler ve ritim göster' },
  { id: 14, title: 'Usher', category: 'artist', description: 'Yumuşak R&B tarzını getir' },
  { id: 15, title: 'Bruno Mars', category: 'artist', description: 'Funk ve soul enerjisiyle performans göster' },
  
  // Celebrities
  { id: 16, title: 'Bruce Lee', category: 'celebrity', description: 'Dövüş sanatları hassasiyetiyle dansı birleştir' },
  { id: 17, title: 'Muhammad Ali', category: 'celebrity', description: 'Kelebek gibi uç, arı gibi sok' },
  { id: 18, title: 'James Brown', category: 'celebrity', description: 'Soul müziğin kralının enerjisini getir' },
  
  // Dancers
  { id: 19, title: 'Les Twins', category: 'dancer', description: 'İkiz senkronizasyonu ve yaratıcılık göster' },
  { id: 20, title: 'B-Boy', category: 'dancer', description: 'Orijinal breaking enerjisini getir' },
  { id: 21, title: 'Popper', category: 'dancer', description: 'Popping tekniklerini kullan' },
  { id: 22, title: 'Locking', category: 'dancer', description: 'Locking stilini göster' },
  
  // Objects
  { id: 23, title: 'Umbrella', category: 'object', description: 'Şemsiyeyi performansına dahil et' },
  { id: 24, title: 'Mirror', category: 'object', description: 'Ayna gibi yansıt ve aynala' },
  { id: 25, title: 'Rope', category: 'object', description: 'İpi dansında prop olarak kullan' },
  { id: 26, title: 'Fire', category: 'object', description: 'Ateş gibi tutkulu ve enerjik ol' },
  { id: 49, title: 'Water Bottle', category: 'object', description: 'Su şişesini ortaya koy ve dansında kullan' },
  { id: 50, title: 'Phone Dance', category: 'object', description: 'Telefonunla dans et, telefonu bir prop olarak kullan' },
  { id: 51, title: 'Card Dance', category: 'object', description: 'Kartlarla dans et, kartları hareketlerine dahil et' },
  { id: 52, title: 'Floor as Object', category: 'object', description: 'Yeri bir obje olarak kullan, yere farklı şekillerde dokun ve etkileşim kur' },
  { id: 53, title: 'Wall Dance', category: 'object', description: 'Duvarda dans et, duvarı bir destek ve prop olarak kullan' },
  { id: 54, title: 'Chair', category: 'object', description: 'Sandalyeyi dansına dahil et, sandalye üzerinde ve etrafında hareket et' },
  { id: 55, title: 'Hat', category: 'object', description: 'Şapkayı performansına dahil et, şapkayı farklı şekillerde kullan' },
  { id: 56, title: 'Scarf', category: 'object', description: 'Eşarbı dansında kullan, eşarbı akıcı hareketlerle kullan' },
  { id: 57, title: 'Shoes', category: 'object', description: 'Ayakkabılarını bir prop olarak kullan, ayakkabılarla yaratıcı hareketler yap' },
  { id: 58, title: 'Backpack', category: 'object', description: 'Sırt çantanı dansına dahil et, çantayı hareketlerine entegre et' },
  
  // Emotions
  { id: 27, title: 'Joy', category: 'emotion', description: 'Sevinç ve mutlulukla dans et' },
  { id: 28, title: 'Anger', category: 'emotion', description: 'Öfke ve güçle performans göster' },
  { id: 29, title: 'Love', category: 'emotion', description: 'Aşk ve tutkuyla hareket et' },
  { id: 30, title: 'Freedom', category: 'emotion', description: 'Özgürlük hissiyle dans et' },
  
  // Movements
  { id: 31, title: 'Wave', category: 'movement', description: 'Dalga gibi akıcı hareket et' },
  { id: 32, title: 'Freeze', category: 'movement', description: 'Donma ve durma tekniklerini kullan' },
  { id: 33, title: 'Spin', category: 'movement', description: 'Dönme ve rotasyon hareketleri yap' },
  { id: 34, title: 'Jump', category: 'movement', description: 'Zıplama ve havada hareket et' },
  
  // Styles
  { id: 35, title: 'Smooth', category: 'style', description: 'Yumuşak ve akıcı bir stil kullan' },
  { id: 36, title: 'Sharp', category: 'style', description: 'Keskin ve net hareketler yap' },
  { id: 37, title: 'Groovy', category: 'style', description: 'Groovy ve ritmik bir tarz göster' },
  { id: 38, title: 'Powerful', category: 'style', description: 'Güçlü ve etkileyici performans göster' },
  
  // Concepts (Creative dance concepts)
  { id: 39, title: 'Time Travel', category: 'concept', description: 'Zamanda yolculuk yaparak geçmiş ve geleceği dansında birleştir', concept: 'Zamanda Yolculuk', story: 'Geçmişten geleceğe bir yolculuk yapıyorsun. Her hareketin bir zaman dilimini temsil ediyor.' },
  { id: 40, title: 'Elements', category: 'concept', description: 'Doğanın elementlerini (ateş, su, toprak, hava) dansında kullan', concept: 'Doğanın Elementleri', story: 'Doğanın gücünü dansında birleştiriyorsun. Ateşin tutkusu, suyun akışkanlığı, toprağın sağlamlığı ve havanın özgürlüğü.' },
  { id: 41, title: 'Transformation', category: 'concept', description: 'Dönüşüm ve değişim temasını dansında işle', concept: 'Dönüşüm', story: 'Bir tırtıldan kelebeğe dönüşüyorsun. Her hareketin bir metamorfoz aşamasını temsil ediyor.' },
  { id: 42, title: 'Dreams', category: 'concept', description: 'Rüyalar ve hayaller dünyasında dans et', concept: 'Rüyalar Alemi', story: 'Rüyalarının içinde kaybolmuşsun. Her hareketin bir rüya sahnesini canlandırıyor.' },
  { id: 43, title: 'Journey', category: 'concept', description: 'Bir yolculuk hikayesi anlat, başlangıçtan varışa kadar', concept: 'Yolculuk', story: 'Uzun bir yolculuğa çıkmışsın. Her adımın yeni bir macerayı temsil ediyor.' },
  
  // Stories (Narrative elements)
  { id: 44, title: 'Hero\'s Journey', category: 'story', description: 'Kahramanın yolculuğunu dansında anlat', concept: 'Kahramanın Yolculuğu', story: 'Sen bir kahramansın. Zorlukları aşıyor, engelleri aşarak ilerliyorsun. Her hareketin bir zafer anını temsil ediyor.' },
  { id: 45, title: 'Love Story', category: 'story', description: 'Bir aşk hikayesini dansında canlandır', concept: 'Aşk Hikayesi', story: 'İki kalbin buluşması. Her hareketin sevgi, tutku ve bağlılığı anlatıyor.' },
  { id: 46, title: 'Rebellion', category: 'story', description: 'İsyan ve özgürlük temasını dansında işle', concept: 'İsyan', story: 'Kurallara karşı çıkıyorsun. Özgürlüğün için savaşıyorsun. Her hareketin bir isyan anını temsil ediyor.' },
  { id: 47, title: 'Victory', category: 'story', description: 'Zafer ve başarı hikayesini dansında anlat', concept: 'Zafer', story: 'Uzun bir mücadelenin sonunda zafer kazandın. Her hareketin başarının coşkusunu yansıtıyor.' },
  { id: 48, title: 'Unity', category: 'story', description: 'Birlik ve beraberlik temasını dansında işle', concept: 'Birlik', story: 'Hep birlikte güçlüyüz. Her hareketin birlik ve dayanışmayı temsil ediyor.' },
];

// Get random flow card
export function getRandomFlowCard(): FlowCard {
  return FLOW_CARDS[Math.floor(Math.random() * FLOW_CARDS.length)];
}

// Calculate new position after move
export function calculateNewPosition(currentPosition: number, diceResult: number, totalSquares: number): number {
  return (currentPosition + diceResult) % totalSquares;
}

// Check if player passes Start square
export function passesStart(currentPos: number, newPos: number, totalSquares: number): boolean {
  return newPos < currentPos;
}

// Get next Cypher Gate position
export function getNextCypherGate(currentGatePosition: number, totalSquares: number): number {
  const cypherGates = [
    BOARD_SQUARES.indexOf('Cypher Gate'),
    BOARD_SQUARES.indexOf('Cypher Gate 2'),
    BOARD_SQUARES.indexOf('Cypher Gate 3'),
  ].filter(idx => idx !== -1);
  
  if (cypherGates.length === 0) return currentGatePosition;
  
  // Find current gate index
  const currentGateIndex = cypherGates.indexOf(currentGatePosition);
  
  // Get next gate (wrap around if at last gate)
  const nextGateIndex = (currentGateIndex + 1) % cypherGates.length;
  
  return cypherGates[nextGateIndex];
}

// Calculate position change based on card effect
export function applyPositionChange(
  currentPosition: number,
  positionChange: number | 'start' | 'nearest_cypher' | 'space' | 'freeze' | 'swap' | 'next_cypher_gate',
  totalSquares: number,
  entryGate?: number | null
): number {
  if (typeof positionChange === 'number') {
    // Move by number of squares (negative = backward, positive = forward)
    let newPos = currentPosition + positionChange;
    // Handle wrapping around the board
    while (newPos < 0) {
      newPos += totalSquares;
    }
    return newPos % totalSquares;
  }

  switch (positionChange) {
    case 'start':
      return 0; // Start square is at index 0
    case 'space':
      return BOARD_SQUARES.indexOf('Space');
    case 'freeze':
      return BOARD_SQUARES.indexOf('Freeze');
    case 'nearest_cypher': {
      // Find nearest Cypher Gate
      const cypherGates = [
        BOARD_SQUARES.indexOf('Cypher Gate'),
        BOARD_SQUARES.indexOf('Cypher Gate 2'),
        BOARD_SQUARES.indexOf('Cypher Gate 3'),
      ].filter(idx => idx !== -1);
      
      if (cypherGates.length === 0) return currentPosition;
      
      // Find the nearest gate (forward direction preferred)
      let nearest = cypherGates[0];
      let minDistance = (cypherGates[0] - currentPosition + totalSquares) % totalSquares;
      
      for (const gate of cypherGates) {
        const distance = (gate - currentPosition + totalSquares) % totalSquares;
        if (distance < minDistance) {
          minDistance = distance;
          nearest = gate;
        }
      }
      
      return nearest;
    }
    case 'next_cypher_gate':
      // Exit from current gate to next gate
      if (entryGate !== null && entryGate !== undefined) {
        return getNextCypherGate(entryGate, totalSquares);
      }
      // If no entry gate specified, find nearest and go to next
      const currentGates = [
        BOARD_SQUARES.indexOf('Cypher Gate'),
        BOARD_SQUARES.indexOf('Cypher Gate 2'),
        BOARD_SQUARES.indexOf('Cypher Gate 3'),
      ].filter(idx => idx !== -1);
      
      if (currentGates.length === 0) return currentPosition;
      
      // Find which gate we're closest to
      let nearestGate = currentGates[0];
      let minDist = (currentGates[0] - currentPosition + totalSquares) % totalSquares;
      
      for (const gate of currentGates) {
        const dist = (gate - currentPosition + totalSquares) % totalSquares;
        if (dist < minDist) {
          minDist = dist;
          nearestGate = gate;
        }
      }
      
      return getNextCypherGate(nearestGate, totalSquares);
    case 'swap':
      // This requires player selection, so we'll handle it separately
      // For now, return current position
      return currentPosition;
    default:
      return currentPosition;
  }
}
