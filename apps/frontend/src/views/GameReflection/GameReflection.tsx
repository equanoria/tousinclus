import { useAppState } from "../../context/AppStateProvider";

export const GameReflection = () => {
  const { titleManager } = useAppState();

  titleManager.set('Phase de réflexion');
  
  return (
    <h1>ça marche</h1>
  )
}






// import type { ExtremeUser, IAnswerData, IDirectusCardsGroup } from '@tousinclus/types';
// import { useState, useEffect, useCallback } from 'react';
// import { useAppState } from '../../context/AppStateProvider';
// import { Checkbox } from '../../components/Checkbox/Checkbox';
// import { Input } from '../../components/Input/Input';

// export const GameReflection = () => {
//   const { gameService, directusService, localeManager, gameData } = useAppState();

//   const [cardsGroup, setCardsGroup] = useState<IDirectusCardsGroup>();
//   const [users, setUsers] = useState<ExtremeUser[]>();
//   const [currentUserIndex, setCurrentUserIndex] = useState(0);

//   const [answerData, setAnswerData] = useState<IAnswerData>({
//     input1: '',
//     input2: '',
//     input3: '',
//     inputCheckboxes: [],
//   });

//   const [localInputs, setLocalInputs] = useState({
//     input1: '',
//     input2: '',
//     input3: '',
//   });

//   // Load group + users
//   useEffect(() => {
//     const fetchCardsGroup = async () => {
//       const group = await directusService.getCardsGroup('51', localeManager.getLocale());
//       setCardsGroup(group);
//       setUsers(group.extreme_user);
//     };

//     fetchCardsGroup();
//   }, [directusService, localeManager]);

//   // Sync local input state when user changes
//   useEffect(() => {
//     setLocalInputs({
//       input1: answerData.input1,
//       input2: answerData.input2,
//       input3: answerData.input3,
//     });
//   }, [answerData.input1, answerData.input2, answerData.input3]);

//   // Update backend when answer changes
//   useEffect(() => {
//     if (!gameData || !cardsGroup) return;
//     const { code, team } = gameData;

//     gameService.updateAnswer(code, {
//       cardId: cardsGroup.extreme_user[currentUserIndex].cards_users_id.id,
//       team,
//       answer: answerData,
//     });
//   }, [answerData, cardsGroup, currentUserIndex, gameData, gameService]);

//   // Input logic
//   const handleLocalChange = (field: keyof typeof localInputs, value: string) => {
//     setLocalInputs((prev) => ({ ...prev, [field]: value }));
//   };

//   const handleBlur = (field: keyof typeof localInputs) => {
//     const value = localInputs[field];
//     setAnswerData((prev) => ({ ...prev, [field]: value }));
//   };

//   // Checkbox
//   const handleCheckboxChange = (id: number, checked: boolean) => {
//     setAnswerData((prev) => ({
//       ...prev,
//       inputCheckboxes: checked
//         ? [...prev.inputCheckboxes, id]
//         : prev.inputCheckboxes.filter((v) => v !== id),
//     }));
//   };

//   // Navigation
//   const goToUser = useCallback((direction: 'prev' | 'next') => {
//     if (!cardsGroup || !cardsGroup.extreme_user.length || !gameData) return;

//     setCurrentUserIndex((prev) => {
//       const lastIndex = cardsGroup.extreme_user.length - 1;
//       return direction === 'prev'
//         ? (prev > 0 ? prev - 1 : lastIndex)
//         : (prev < lastIndex ? prev + 1 : 0);
//     });

//     const { code, team } = gameData;
//     gameService.getAnswers({ code, team });
//   }, [cardsGroup, gameData, gameService]);

//   return (
//     <>
//       <h2>Phase de réflexion</h2>

//       {cardsGroup && (
//         <div>
//           <h3>
//             Situation : {cardsGroup.usage_situation.context_translations[0].context}
//           </h3>
//           <p>{cardsGroup.usage_situation.description_translations[0].description}</p>
//           <img
//             src={directusService.getAssetUrl(cardsGroup.usage_situation.image)}
//             alt="situation"
//             style={{ width: '200px' }}
//           />
//         </div>
//       )}

//       {/* Navigation utilisateurs */}
//       <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '1rem 0' }}>
//         <button type="button" onClick={() => goToUser('prev')}>←</button>
//         {cardsGroup?.extreme_user?.map((user, index) => (
//           <div
//             key={user.cards_users_id.id}
//             style={{
//               padding: '0.25rem 0.5rem',
//               border: index === currentUserIndex ? '2px solid black' : '1px solid #ccc',
//               borderRadius: '4px',
//               cursor: 'pointer',
//             }}
//             onClick={() => setCurrentUserIndex(index)}
//             onKeyDown={(e) => {
//               if (e.key === 'Enter' || e.key === ' ') {
//                 setCurrentUserIndex(index);
//               }
//             }}
//           >
//             {index + 1}
//           </div>
//         ))}
//         <button type="button" onClick={() => goToUser('next')}>→</button>
//       </div>

//       {/* Carte utilisateur + formulaire */}
//       {users?.[currentUserIndex] && (
//         <div style={{ marginTop: '1rem' }}>
//           <h4>Utilisateur extrême</h4>
//           <p>{users[currentUserIndex].cards_users_id.translations[0].description}</p>
//           <img
//             src={directusService.getAssetUrl(users[currentUserIndex].cards_users_id.image)}
//             alt="user"
//             style={{ width: '150px' }}
//           />

//           <form onSubmit={(e) => e.preventDefault()}>
//             <Input
//               placeholder="Entrez votre réponse"
//               label="1. Quelles solutions proposez-vous ?"
//               value={localInputs.input1}
//               onChange={(e) => handleLocalChange('input1', e.target.value)}
//               onBlur={() => handleBlur('input1')}
//             />
//             <Input
//               placeholder="Entrez votre réponse"
//               label="2. Quelles solutions proposez-vous ?"
//               value={localInputs.input2}
//               onChange={(e) => handleLocalChange('input2', e.target.value)}
//               onBlur={() => handleBlur('input2')}
//             />
//             <Input
//               placeholder="Entrez votre réponse"
//               label="3. Quelles solutions proposez-vous ?"
//               value={localInputs.input3}
//               onChange={(e) => handleLocalChange('input3', e.target.value)}
//               onBlur={() => handleBlur('input3')}
//             />

//             <div>
//               <p>Quels sont les autres utilisateurs extrêmes concernés ?</p>
//               {users
//                 ?.filter((_, idx) => idx !== currentUserIndex)
//                 .map((user) => {
//                   const id = user.cards_users_id.id;
//                   const label = user.cards_users_id.translations[0].description;
//                   return (
//                     <Checkbox
//                       key={id}
//                       label={label}
//                       checked={answerData.inputCheckboxes.includes(id)}
//                       onChange={(e) => handleCheckboxChange(id, e.target.checked)}
//                     />
//                   );
//                 })}
//             </div>

//             <input
//               type="button"
//               value="Soumettre"
//               style={{ marginTop: '1rem' }}
//             />
//           </form>
//         </div>
//       )}
//     </>
//   );
// };
