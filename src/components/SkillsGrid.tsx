import { useRef, useState } from 'react';
import './SkillGrid.css';
import { Input } from "@/components/ui/input"
import { Button } from './ui/button';
import { Cross1Icon } from '@radix-ui/react-icons';

const SKILLS: string[] = [
  'Java',
  'TypeScript',
  'JavaScript',
  'Python',
  'Django',
  'Flask',
  'FastAPI',
  'Nodejs',
  'Next',
  'Nuxt',
  'Vuejs',
  'MySQL',
  'PostgreSQL',
  'MongoDB',
  'Shell',
  'Bash',
  'Git',
  'Docker',
  'AWS',
  'HTML',
  'CSS',
  'SASS',
  'TailwindCSS',
  'Bootstrap',
  'MaterialDesign',
  'Jasmine',
  'Karma',
  'Jest',
  'Cypress',
  'JUnit',
  'Mockito',
  'Hibernate',
  'REST',
  'Jira',
  'Confluence',
  'Bitbucket',
  'GitLab',
  'Liquibase',
  'Maven',
  'Gradle',
  'Ionic',
  'Capacitor',
  'SSR',
]

export interface WordCell {
  word: string;
  wordIndex: number;
  size: number;
  delay: number;
  empty?: boolean;
}

const SkillsGrid = () => {

  const rows = 10;
  const columns = Math.ceil(SKILLS.reduce((acc, skill) => acc + skill.length, 0) / rows);

  const filledRows: string[][] = [];
  let remainingWords = [...SKILLS].sort((a, b) => b.length - a.length);

  while (remainingWords.length > 0) {
    let currentLine: string[] = [];
    let currentLength = 0;
    let i = 0;

    while (i < remainingWords.length) {
      if (currentLength + remainingWords[i].length <= columns) {
        currentLine.push(remainingWords[i]);
        currentLine.push(' ');
        currentLength += remainingWords[i].length + 1;
        remainingWords.splice(i, 1);
      } else {
        i++;
      }
    }

    if (currentLine.length === 0 && remainingWords.length > 0) {
      currentLine.push(remainingWords[0]);
      remainingWords.splice(0, 1);
    }

    currentLine = currentLine.slice(0, currentLine.length - 1);
    const lineCharAmount = currentLine.reduce((acc, str) => acc + str.length, 0);

    if(lineCharAmount < columns) {
      const delta = columns - lineCharAmount;
      if(currentLine.length === 1) {
        currentLine.push(' '.repeat(delta));
      } else {
        const blankSpaces = currentLine.filter(str => str === ' ').length;
        const spacesToAdd = Math.floor(delta / blankSpaces);
        const remainder = delta % blankSpaces;
        currentLine = currentLine.map((str, index) => {
          if (str === ' ') {
            const space = str + ' '.repeat(spacesToAdd);
            return index == 1 && remainder > 0 ? space + ' '.repeat(remainder) : space;
          } else {
            return str;
          }
        })
      }
    }

    filledRows.push(currentLine);
  }

  const [ hovered, setHovered ] = useState<number | null>(null);

  const handleMouseEnter = (cell: WordCell) => {
    const index = cell.empty ? null : cell.wordIndex;
    setHovered(index);
  }

  const handleMouseLeave = () => {
    setHovered(null);
  }


  let wordCount = 0;
  const words: WordCell[][] = filledRows.map(line => {
    return line.map(word => {
      wordCount++;
      return {
        word: word,
        wordIndex: wordCount,
        size: word.length,
        delay: wordCount * 0.1,
        empty: word.trim() === '',
      }
    });
  });

  const [ foundedIds, setFoundedIds ] = useState<number[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (!value || value.trim().length < 2){
      setFoundedIds([]);
      return;
    }

    const regex = new RegExp(value, 'i');

    const foundedWords: WordCell[] = words.flat().filter(word => regex.test(word.word));

    if (foundedWords.length > 0) {
      setFoundedIds(foundedWords.map(word => word.wordIndex));
    } else {
      setFoundedIds([]);
    }
  }

  const clearSearch = () => {
    if(searchInputRef.current) searchInputRef.current.value = '';
    setFoundedIds([]);
  }

  return (
    <div className="flex flex-col items-center justify-center pb-12">
      <div className="w-[70vw] md:w-[80vw] mb-4 flex items-center justify-around gap-2">
        <Input type="text" placeholder="Seach for one ;)" onChange={onSearch} ref={searchInputRef} />
        {foundedIds.length > 0 &&  <Button variant="ghost" size="icon" className="absolute right-[15vw] md:right-[10vw]" onClick={clearSearch}><Cross1Icon className="h-4 w-4" /></Button>}
      </div>
      <div style={{
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gridTemplateRows: `repeat(${rows}, 1fr)`,
        }}
        className="w-[75vw] md:w-[80vw] grid">
        {words.map(line => {
          let offset = 0;
          return line.map(wordCell => {
            offset = offset + wordCell.size 
            return (
              <div 
                key={wordCell.wordIndex} 
                onMouseEnter={() => handleMouseEnter(wordCell)}
                onMouseLeave={handleMouseLeave}
                style={{ 
                  animationDelay: wordCell.delay + 's',
                  gridColumn: `${1 + offset - wordCell.size} / span ${wordCell.size}`,
                  gridTemplateColumns: `repeat(${wordCell.size}, 1fr)`
                }} 
                className={`
                  uppercase grid text-xs h-6 md:text-2xl md:h-12 
                  ${(hovered !== null && hovered !== wordCell.wordIndex) || foundedIds.length ? 'idle' : ''} 
                  ${foundedIds.includes(wordCell.wordIndex) ? 'founded' : ''} 
                  ${wordCell.empty ? '' : 'word-cell'}
                `}
              >
                    {wordCell.word.split('').map((char, i)=> (<div key={i} className="flex items-center justify-center">{char}</div>))}
              </div>
            )
          })
        })}
      </div>
    </div>
  );
};

export default SkillsGrid;

