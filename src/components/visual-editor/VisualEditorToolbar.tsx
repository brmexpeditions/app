import { useVisualEditor } from './VisualEditorContext';

export function VisualEditorToolbar() {
    const {
        isEditing,
        toggleEditing,
        selectedElementId,
        overrides,
        updateStyle,
        saveChanges,
        resetElement,
        hasUnsavedChanges
    } = useVisualEditor();

    if (!isEditing) {
        return (
            <div className="fixed bottom-4 right-4 z-[9999]">
                <button
                    onClick={toggleEditing}
                    className="bg-gray-900 border border-gray-700 text-white rounded-full px-5 py-3 shadow-2xl flex items-center gap-2 hover:bg-gray-800 transition-all"
                >
                    <span className="text-xl">🖌️</span>
                    <span className="font-semibold">Visual Editor</span>
                </button>
            </div>
        );
    }

    const selectedStyle = selectedElementId ? overrides[selectedElementId] : null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-[9999] bg-gray-900 border-t border-gray-800 shadow-2xl p-4 animate-slide-up">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center">
                            <span className="text-xl">🎨</span>
                        </div>
                        <div>
                            <h3 className="font-bold text-white">Visual Editor</h3>
                            <p className="text-xs text-gray-400">
                                {selectedElementId ? `Editing: ${selectedElementId}` : 'Select an element to edit'}
                            </p>
                        </div>
                    </div>

                    <div className="h-8 w-px bg-gray-800"></div>

                    {selectedElementId ? (
                        <div className="flex items-center gap-4">
                            {/* Font Size Control */}
                            <div className="flex flex-col gap-1">
                                <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Font Size</label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        value={selectedStyle?.fontSize || ''}
                                        onChange={(e) => updateStyle(selectedElementId, { fontSize: e.target.value })}
                                        placeholder="e.g. 2rem, 16px"
                                        className="bg-gray-800 border-gray-700 text-white text-sm rounded px-2 py-1 w-24 focus:ring-1 focus:ring-amber-500 outline-none"
                                    />
                                </div>
                            </div>

                            {/* Color Control */}
                            <div className="flex flex-col gap-1">
                                <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Color</label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="color"
                                        value={selectedStyle?.color || '#ffffff'}
                                        onChange={(e) => updateStyle(selectedElementId, { color: e.target.value })}
                                        className="w-8 h-8 rounded cursor-pointer bg-transparent border-none p-0"
                                    />
                                    <input
                                        type="text"
                                        value={selectedStyle?.color || ''}
                                        onChange={(e) => updateStyle(selectedElementId, { color: e.target.value })}
                                        placeholder="#ffffff"
                                        className="bg-gray-800 border-gray-700 text-white text-sm rounded px-2 py-1 w-24 focus:ring-1 focus:ring-amber-500 outline-none"
                                    />
                                </div>
                            </div>

                            <div className="h-8 w-px bg-gray-800 mx-2"></div>

                            <button
                                onClick={() => resetElement(selectedElementId)}
                                className="text-xs text-red-400 hover:text-red-300 underline"
                            >
                                Reset Element
                            </button>
                        </div>
                    ) : (
                        <div className="text-gray-500 italic text-sm">
                            Click any highlighted element above to style it
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-3">
                    {hasUnsavedChanges && (
                        <span className="text-amber-400 text-xs font-medium animate-pulse">
                            ● Unsaved Changes
                        </span>
                    )}
                    <button
                        onClick={saveChanges}
                        disabled={!hasUnsavedChanges}
                        className={`px-5 py-2.5 rounded-lg font-bold text-sm transition-all ${hasUnsavedChanges
                                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-black hover:shadow-lg hover:shadow-amber-500/20'
                                : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                            }`}
                    >
                        Save Changes
                    </button>
                    <button
                        onClick={toggleEditing}
                        className="px-5 py-2.5 bg-gray-800 text-white rounded-lg font-bold text-sm hover:bg-gray-700 transition-all border border-gray-700"
                    >
                        Exit Editor
                    </button>
                </div>
            </div>
        </div>
    );
}
