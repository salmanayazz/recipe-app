import { useState, useEffect, useRef } from 'react';
import { FiSearch } from 'react-icons/fi';
import TextInput from './TextInput';
import { useRecipes } from '../contexts/RecipesContext';

export default function Search() {
    const { fetchRecipes } = useRecipes();
    const [showSearch, setShowSearch] = useState<boolean>(false);
    const [recipeName, setRecipeName] = useState<string>('');
    const searchRef = useRef(null);

    const toggleSearch = () => {
        setShowSearch(!showSearch);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            // if (searchRef.current && !searchRef.current.contains(event.target)) {
            //     setShowSearch(false);
            // }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [searchRef]);

    const handleSearch = () => {
        fetchRecipes({ recipeName: recipeName });
    };

    return (
        <div
            className='flex justify-center items-center text-sec-100'
        >
            <FiSearch onClick={toggleSearch} />
            {showSearch && (
                <div 
                    ref={searchRef}
                    className='flex'
                >
                    <TextInput
                        placeholder='Recipe name'
                        onChange={(value) => setRecipeName(value)}
                        textValue={recipeName}                    
                    />
                    <button onClick={handleSearch}>Confirm</button>
                    <button onClick={() => setShowSearch(false)}>Cancel</button>
                </div>
            )}
        </div>
    );
};
