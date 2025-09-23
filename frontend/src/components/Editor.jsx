import React, { useState } from 'react';
import { FaSpellCheck, FaSyncAlt, FaCheck, FaPencilAlt } from 'react-icons/fa';
import { SiGrammarly } from 'react-icons/si';
import axios from 'axios';
import { usePrivy } from '@privy-io/react-auth';

const Editor = () => {
  const { getAccessToken } = usePrivy();
  const [sentence, setSentence] = useState('');
  const [selectedSentence, setSelectedSentence] = useState('');
  const [rephrasedSentences, setRephrasedSentences] = useState('');
  const [correctedSentences, setCorrectedSentences] = useState('');
  const [spellCheckedText, setSpellCheckedText] = useState('');
  const [grammarCheckedText, setGrammarCheckedText] = useState('');

  // handle Selected text
  const handleSentenceSelection = () => {
    const selection = window.getSelection().toString();
    if (selection) {
      setSelectedSentence(selection);
    }
  };

  // Rephrase Sentence
  const rephraseSentence = async () => {
    try {
      const response = await axios.post(
        'http://localhost:8000/api/rephrase',
        { sentence: selectedSentence },
        {
          headers: {
            Authorization: `Bearer ${await getAccessToken()}`,
          },
        }
      );
      console.log(response.data);
      setRephrasedSentences(response.data.rephrasedSentence || '');
    } catch (error) {
      console.error('Grammar check error:', error);
      setRephrasedSentences('Error checking grammar');
    }
  };

  // Adding corrected sentence
  const addCorrectedSentence = (sentence) => {
    setCorrectedSentences([...correctedSentences, sentence]);
  };

  // Check Spelling
  const checkSpelling = async () => {
    try {
      const response = await axios.post(
        'http://localhost:8000/api/spellcheck',
        { sentence },
        {
          headers: {
            Authorization: `Bearer ${await getAccessToken()}`,
          },
        }
      );
      console.log(response.data);
      setSpellCheckedText(response.data.checkedText || '');
    } catch (error) {
      console.error('Spelling check error:', error);
      setSpellCheckedText('Error checking spelling');
    }
  };

  // Check Grammar
  const checkGrammar = async () => {
    try {
      const response = await axios.post(
        'http://localhost:8000/api/grammarcheck',
        { sentence },
        {
          headers: {
            Authorization: `Bearer ${await getAccessToken()}`,
          },
        }
      );
      console.log(response.data);
      setGrammarCheckedText(response.data.correctedSentence || '');
    } catch (error) {
      console.error('Grammar check error:', error);
      setGrammarCheckedText('Error checking grammar');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-100 min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4 text-blue-600">
              AI WRITING ASSISTANT
            </h2>
            <p className="mb-4 text-gray-600">
              Enhance your writing with our advanced AI tools.
            </p>
            <textarea
              value={sentence}
              onChange={(e) => setSentence(e.target.value)}
              onMouseUp={handleSentenceSelection}
              placeholder="Enter Your Text Here"
              rows={10}
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
            <div className="flex justify-end mt-4 space-x-4">
              <Button onClick={checkSpelling} icon={<FaSpellCheck />}>
                Check Spelling
              </Button>
              <Button onClick={checkGrammar} icon={<SiGrammarly />}>
                Grammar Checking
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ResultSection
              sentence={spellCheckedText}
              title="Spell Check Text"
              icon={<FaSpellCheck className="text-green-500" />}
              onAccept={() => addCorrectedSentence(spellCheckedText)}
            />
            <ResultSection
              sentence={grammarCheckedText}
              title="Grammar Check Text"
              icon={<SiGrammarly className="text-blue-500" />}
              onAccept={() => addCorrectedSentence(grammarCheckedText)}
            />
          </div>

          {selectedSentence && (
            <div className="bg-white shadow-lg rounded-lg p-6 my-8">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <FaPencilAlt className="mr-2 text-purple-500" />
                Selected Sentence:
              </h3>
              <p className="mb-4">{selectedSentence}</p>
              <Button onClick={rephraseSentence} icon={<FaSyncAlt />}>
                Rephrase
              </Button>
            </div>
          )}

          {rephrasedSentences && (
            <div className="bg-white shadow-lg rounded-lg p-6 my-8">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <FaSyncAlt className="mr-2 text-indigo-500" />
                Rephrased Sentences:
              </h3>
              <div className="mb-4 pb-4 border-b border-gray-200 last:border-b-0">
                <p className="mb-2">{rephrasedSentences}</p>
                <Button
                  onClick={() => addCorrectedSentence(rephrasedSentences)}
                  icon={<FaCheck />}
                >
                  Accept
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="md:col-span-1">
          <div className="bg-white shadow-lg rounded-lg p-6 sticky top-8">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <FaCheck className="mr-2 text-green-500" />
              Corrected Sentences
            </h3>
            <p className="mb-4 text-gray-600">
              Your approved corrections will appear here.
            </p>
            {correctedSentences.length > 0 ? (
              correctedSentences.map((sentence, index) => (
                <div
                  key={index}
                  className="mb-2 pb-2 border-b border-gray-200 last:border-b-0"
                >
                  <p>{sentence}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 italic">
                No corrected sentences yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const Button = ({ onClick, children, icon }) => (
  <button
    onClick={onClick}
    className="bg-blue-600 text-white px-4 py-2 rounded-full font-semibold hover:bg-blue-700 transition duration-300 flex items-center"
  >
    {icon && <span className="mr-2">{icon}</span>}
    {children}
  </button>
);

const ResultSection = ({ sentence, title, onAccept, icon }) => (
  sentence ? (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h3 className="text-xl font-semibold mb-4 flex items-center">
        {icon}
        <span className="ml-2">{title}</span>
      </h3>
      <p className="mb-4">{sentence}</p>
      <Button onClick={onAccept} icon={<FaCheck />}>
        Accept
      </Button>
    </div>
  ) : null
);

export default Editor;