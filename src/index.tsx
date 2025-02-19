import produce from 'immer';
import React, { FC, useState } from 'react';
import { render } from 'react-dom';
import { Language, translate } from './deepl-client/src/index';

const Main: FC = () => {
  const [deeplKey, setDeeplKey] = useState('');
  const [translateText, setTranslateText] = useState('');
  const TRANSLATING = 'translating';
  const TRANSLATED = 'translated';
  const WAITING = 'waiting';
  type TranslateStatus =
    | typeof TRANSLATING
    | typeof TRANSLATED
    | typeof WAITING;
  type TranslateData = {
    language: string;
    languageKey: Language;
    text: string;
    status: TranslateStatus;
  };
  const [translateData, setTranslateData] = useState<TranslateData[]>(
    ([
      [Language.German, 'German'],
      [Language.French, 'French'],
      [Language.Spanish, 'Spanish'],
      [Language.Italian, 'Italian'],
      [Language.Portuguese, 'Portuguese'],
      [Language.Polish, 'Polish'],
      [Language.Russian, 'Russian'],
      [Language.Japanese, 'Japanese'],
      [Language.Dutch, 'Dutch'],
      [Language.Czech, 'Czech'],
      [Language.Chinese, 'Chinese'],
    ] as [Language, string][]).map(([languageKey, language]) => ({
      language,
      languageKey,
      text: '',
      status: WAITING,
    }))
  );
  return (
    <div>
      <form
        onSubmit={(e) => {
          setTranslateData((t) =>
            t.map(({ language, languageKey }) => ({
              language,
              languageKey,
              text: '',
              status: TRANSLATING,
            }))
          );
          translateData.map(async ({ languageKey }, i) => {
            const t = await translate({
              source_lang: Language.English,
              target_lang: languageKey,
              text: translateText,
              auth_key: deeplKey,
            });
            console.log(t);
            setTranslateData((td) =>
              produce(td, (draft) => {
                draft[i].status = TRANSLATED;
                draft[i].text = t.translations[0]?.text;
              })
            );
          });
          e.preventDefault();
        }}
      >
        <input
          value={deeplKey}
          onChange={(e) => setDeeplKey(e.currentTarget.value)}
        />
        <textarea
          value={translateText}
          onChange={(e) => setTranslateText(e.currentTarget.value)}
        />
        <button type="submit">Translate</button>
      </form>
      <ul>
        {translateData.map(({ language, text, status }) => (
          <li key={language}>
            <p>{language}</p>
            {status === TRANSLATING ? (
              <p>Translating...</p>
            ) : (
              <textarea value={text} readOnly />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};
render(<Main />, document.getElementById('root'));
